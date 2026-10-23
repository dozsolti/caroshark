using System.Text;

namespace CloudflightEnvironment
{
    class Level3 : Level
    {
        public Level3() : base(3) { }
        public override List<string> Solve()
        {
            List<string> result = new List<string>();

            int problems = int.Parse(input[0]);
            int driver = 1;

            for (int i = 1; i <= problems; i++)
            {
                // Process each problem
                string toParse = input[driver];
                driver++;

                int radius = int.Parse(toParse.Split(' ')[0]);
                int rows = int.Parse(toParse.Split(" ")[1]);
                int cols = int.Parse(toParse.Split(" ")[2]);

                char[][] grid = new char[rows][];
                int[][] marked = new int[rows][];
                List<(int, int, int)> startCells = new List<(int, int, int)>();
                for (int r = 0; r < rows; r++)
                {

                    grid[r] = new char[cols];
                    marked[r] = new int[cols];
                    for (int c = 0; c < cols; c++)
                    {
                        grid[r][c] = input[driver][c];
                        if (grid[r][c] >= '1' && grid[r][c] <= '9')
                        {
                            startCells.Add((r, c, int.Parse(grid[r][c].ToString())));
                        }
                    }
                    driver++;
                }

                foreach((int,int,int) cell in startCells)
                {
                    int startRow = cell.Item1;
                    int startCol = cell.Item2;
                    int dir = cell.Item3;

                    int driverCol = startCol;
                    int driverRow = startRow;

                    while (driverCol >= 0 && driverCol < cols && driverRow >= 0 && driverRow < rows)
                    {
                        //result.Add($"Driver at ({driverRow}, {driverCol})");
                        //grid[driverRow][driverCol] = 'X';
                        int newRow = driverRow + Dirs[dir - 1][0];
                        int newCol = driverCol + Dirs[dir - 1][1];
                        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols)
                        {
                            break;
                        }
                        if (grid[newRow][newCol] == 'O' || grid[newRow][newCol] == 'M')
                        {
                            marked[newRow][newCol]++;                    
                        }
                        driverRow = newRow;
                        driverCol = newCol;
                    }
                }

                //result.Add($"Problem {i}: start at ({startRow}, {startCol}), direction: {dir}");
                

                

                for (int r = 0; r < rows; r++)
                {
                    StringBuilder sb = new StringBuilder();
                    for (int c = 0; c < cols; c++)
                    {
                        if (grid[r][c] == 'O')
                        {
                            if (marked[r][c] == 2)
                                sb.Append('M');
                            else
                            {
                                sb.Append('O');
                            }

                        }
                        else if(grid[r][c] == 'M' && marked[r][c] > 2)
                        {
                            sb.Append('O');
                        }
                        else
                        {
                            sb.Append(grid[r][c]);
                        }
                    }
                    result.Add(sb.ToString());
                }

                result.Add(Environment.NewLine);
                driver++;
            }

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
