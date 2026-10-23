using System.Text;

namespace CloudflightEnvironment
{
    class Level2 : Level
    {
        public Level2() : base(2) { }
        public override List<string> Solve()
        {
            List<string> result = new List<string>();

            int problems = int.Parse(input[0]);
            int driver = 1;

            for(int i = 1; i <= problems; i++)
            {
                // Process each problem
                string toParse = input[driver];
                driver++;

                int radius = int.Parse(toParse.Split(' ')[0]);
                int rows = int.Parse(toParse.Split(" ")[1]);
                int cols = int.Parse(toParse.Split(" ")[2]);

                char[][] grid = new char[rows][];
                int startRow = -1;
                int startCol = -1;
                for (int r = 0; r < rows; r++)
                {

                    grid[r] = new char[cols];
                    for (int c = 0; c < cols; c++)
                    {
                        grid[r][c] = input[driver][c];
                        if (grid[r][c] >= '1' && grid[r][c] <= '9')
                        {
                            startRow = r;
                            startCol = c;
                        }
                    }
                    driver++;
                }

                int dir = int.Parse(grid[startRow][startCol].ToString());

                //result.Add($"Problem {i}: start at ({startRow}, {startCol}), direction: {dir}");
                driver++;

                int driverCol = startCol;
                int driverRow = startRow;

                while(driverCol >= 0 && driverCol < cols && driverRow >= 0 && driverRow < rows)
                {
                    //result.Add($"Driver at ({driverRow}, {driverCol})");
                    //grid[driverRow][driverCol] = 'X';
                    int newRow = driverRow + Dirs[dir - 1][0];
                    int newCol = driverCol + Dirs[dir - 1][1];
                    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols)
                    {
                        break;
                    }
                    if (grid[newRow][newCol] == 'O')
                    {
                        grid[newRow][newCol] = 'M';
                    }
                    driverRow = newRow;
                    driverCol = newCol;
                }

                for(int r = 0; r < rows; r++)
                {
                    StringBuilder sb = new StringBuilder();
                    for (int c = 0; c < cols; c++)
                    {
                        sb.Append(grid[r][c]);
                    }
                    result.Add(sb.ToString());
                }

                result.Add(Environment.NewLine);

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
