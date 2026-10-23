using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudflightEnvironment
{
    class Level5 : Level
    {
        public Level5() : base(5) { }
        public override List<string> Solve()
        {
            List<string> result = new List<string>();

            int problems = int.Parse(input[0]);
            int driver = 1;

            for (int i = 1; i <= problems; i++)
            {
                int submitted = 0;
                // Process each problem
                string toParse = input[driver];
                driver++;

                int radius = int.Parse(toParse.Split(' ')[0]);
                int rows = int.Parse(toParse.Split(" ")[1]);
                int cols = int.Parse(toParse.Split(" ")[2]);

                List<Hexa> pattern = new List<Hexa>();
                for (int r = 0; r < rows; r++)
                {
                    for (int c = 0; c < cols; c++)
                    {
                        char p = input[driver][c];
                        if(p == 'M')
                            pattern.Add(new Hexa(r, c) { Material = 1 });
                    }
                    driver++;
                }

                string toparse3 = input[driver];
                driver++;
                int instructions = int.Parse(toparse3);

                List<string> gen = GetMatrix(radius);

                Hexa[][] grid = new Hexa[gen.Count][];

                for (int row = 0; row < gen.Count; row++)
                {
                    grid[row] = new Hexa[gen[row].Length];
                    for (int col = 0; col < gen[row].Length; col++)
                    {
                        //if(pattern.Any(p => p.Row == row && p.Col == col))
                        //{
                        //    grid[row][col] = new Hexa(row, col) { Material = 1 };
                        //}
                        if (gen[row][col] == 'O')
                        {
                            grid[row][col] = new Hexa(row, col) { Mark = 0 };
                        }
                        else if (gen[row][col] == '*')
                        {
                            grid[row][col] = new Hexa(row, col) { IsBorder = true };
                        }
                        else
                        {
                            grid[row][col] = null;
                        }
                    }
                }

                // emitter one

                Emm one = new Emm(radius, 0, 1);

                Emm two = new Emm(0, radius, 2);

                Emm three = new Emm(0, grid[0].Length - radius - 1, 3);

                Emm four = new Emm(radius, grid[radius].Length - 1, 4);

                Emm five = new Emm(grid.Length - 1, grid[grid.Length - 1].Length - radius - 1, 5);

                Emm six = new Emm(grid.Length - 1, radius, 6);

                List<Emm> emmitters = new List<Emm>()
                {
                    one, two, three, four, five, six
                };

                for (int row = 0; row < grid.Length; row++)
                {
                    for (int col = 0; col < grid[row].Length; col++)
                    {
                        if (grid[row][col] != null && grid[row][col].IsBorder)
                        {
                            Hexa current = grid[row][col];
                            (int cRow, int cCol) = FindClockwise(row, col, radius, grid);
                            Hexa clockwise = grid[cRow][cCol];
                            current.Clock = clockwise;
                            clockwise.AntiClock = current;

                        }
                    }
                }


                for (int set = 0; set < instructions; set++)
                {
                    string instruction = input[driver];
                    driver++;

                    string[] parts = instruction.Split(' ');

                    for (int part = 0; part < parts.Length; part++)
                    {
                        Emm emmiter = emmitters[part];

                        if (parts[part] == "F") // clockwise
                        {
                            Hexa clockwise = grid[emmiter.Row][emmiter.Col].Clock;

                            emmiter.Row = clockwise.Row;
                            emmiter.Col = clockwise.Col;

                        }
                        if (parts[part] == "B") // aclockwise
                        {
                            Hexa aclockwise = grid[emmiter.Row][emmiter.Col].AntiClock;
                            emmiter.Row = aclockwise.Row;
                            emmiter.Col = aclockwise.Col;
                        }

                        if (parts[part] == "T")
                        {
                            emmiter.IsActive = !emmiter.IsActive;
                        }




                    }

                    foreach (Emm em in emmitters)
                    {
                        if (!em.IsActive)
                        {
                            continue;
                        }

                        int startRow = em.Row;
                        int startCol = em.Col;
                        int[] dir = Dirs[em.Dir - 1];

                        while (true)
                        {
                            startRow += dir[0];
                            startCol += dir[1];
                            if (startRow < 0 || startRow >= grid.Length || startCol < 0 || startCol >= grid[startRow].Length)
                                break;
                            Hexa current = grid[startRow][startCol];
                            if (current == null)
                                continue;

                            if (!current.IsBorder)
                                current.Mark++;
                        }
                    }

                    for (int row = 0; row < grid.Length; row++)
                    {
                        for (int col = 0; col < grid[row].Length; col++)
                        {
                            if (grid[row][col] != null && grid[row][col].Mark > 2)
                            {
                                grid[row][col].Material = 0;
                            }
                            else if (grid[row][col] != null && grid[row][col].Mark == 2)
                            {
                                grid[row][col].Material = 1;
                            }
                            if (grid[row][col] != null)
                                grid[row][col].Mark = 0;
                        }
                    }

                    bool submit = true;
                    foreach (Hexa pat in pattern)
                    {
                        if (!submit)
                            break;
                        if (grid[pat.Row][pat.Col].Material == 1)
                        {
                            foreach (int[] dir in Dirs)
                            {
                                int newRow = pat.Row + dir[0];
                                int newCol = pat.Col + dir[1];
                                if (newRow < 0 || newRow >= grid.Length || newCol < 0 || newCol >= grid[newRow].Length)
                                    continue;
                                Hexa neighbor = grid[newRow][newCol];

                                if (pattern.Any(p => p.Row == newRow && p.Col == newCol))
                                    continue;

                                if (neighbor != null && neighbor.Material == 1)
                                    submit = false;

                            }
                        }
                        else
                            submit = false;
                    }

                    if (submit)
                    {
                        foreach(Hexa pat in pattern)
                        {
                            grid[pat.Row][pat.Col].Material = 0;
                        }
                        submitted++;

                    }                

                }

                result.Add(submitted.ToString());

                driver++;
            }

            return result;
        }
        public (int, int) FindClockwise(int row, int col, int radius, Hexa[][] grid)
        {
            int newR = row, newC = col;
            if (row == 0 && col == grid[0].Length - radius - 1)
            {
                return (row + 1, col + 1);
            }
            else if (row == grid.Length - 1 && col == radius)
            {
                return (row - 1, col - 1);
            }

            if (row == 0)
            {
                newC += 2;
                return (row, newC);
            }
            if (row == grid.Length - 1)
            {
                newC -= 2;
                return (row, newC);
            }

            if (row > 0 && row < grid.Length - 1)
            {
                if (col < grid[0].Length / 2)
                {
                    newR--;
                }
                else
                {
                    newR++;
                }
            }

            if (row < grid.Length / 2)
            {
                newC++;
            }
            else if (row > grid.Length / 2)
            {
                newC--;
            }
            else
            {
                if (col == 0)
                    newC++;
                else
                    newC--;
            }

            return (newR, newC);
        }

        public class Hexa
        {
            public int Row { get; set; }
            public int Col { get; set; }
            public Hexa(int row, int col)
            {
                Row = row;
                Col = col;
            }
            public bool IsBorder { get; set; }
            public Hexa Clock { get; set; }
            public Hexa AntiClock { get; set; }

            public int Material = -1;
            public int Mark = -1;
            public int Dir = 0;

        }

        public class Emm
        {
            public int Row { get; set; }
            public int Col { get; set; }
            public bool IsActive { get; set; }
            public int Dir { get; set; }

            public Emm(int row, int col, int dir)
            {
                Row = row;
                Col = col;
                Dir = dir;
            }
        }

        public class Instruction
        {
            public string Type { get; set; }

        }


        public List<string> GetMatrix(int radius)
        {
            var result = new List<string>();


            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < radius; i++)
                sb.Append('-');
            for (int i = 0; i < radius + 1; i++)
                sb.Append("*-");
            for (int i = 0; i < radius - 1; i++)
                sb.Append('-');

            result.Add(sb.ToString());

            for (int row = 0; row < radius; row++)
            {
                StringBuilder line = new StringBuilder();
                for (int i = 0; i < radius - row - 1; i++)
                    line.Append('-');
                line.Append("*-");
                for (int i = 0; i < radius + row; i++)
                    line.Append("O-");
                line.Append("*");
                for (int i = 0; i < radius - row - 1; i++)
                    line.Append('-');

                result.Add(line.ToString());
            }

            for (int row = radius - 2; row >= 0; row--)
            {
                StringBuilder line = new StringBuilder();
                for (int i = 0; i < radius - row - 1; i++)
                    line.Append('-');
                line.Append("*-");
                for (int i = 0; i < radius + row; i++)
                    line.Append("O-");
                line.Append("*");
                for (int i = 0; i < radius - row - 1; i++)
                    line.Append('-');

                result.Add(line.ToString());
            }

            sb = new StringBuilder();
            for (int i = 0; i < radius; i++)
                sb.Append('-');
            for (int i = 0; i < radius + 1; i++)
                sb.Append("*-");
            for (int i = 0; i < radius - 1; i++)
                sb.Append('-');

            result.Add(sb.ToString());





            return result;
        }

        public List<int[]> Dirs = new List<int[]>() { 
             //new int[] { -1, 0 }, // Up
             //new int[] { 1, 0 }, // Down
             
             new int[] { 0, 1 }, // Right
             new int[] { 1, 1 }, // Down - Right
             new int[] { 1, -1 }, // Down - Left
             new int[] { 0, -1 }, // Left
             
             new int[] { -1, -1 },  // UP - Left
             new int[] { -1, 1 } // Up - Right

        };

    }
}
