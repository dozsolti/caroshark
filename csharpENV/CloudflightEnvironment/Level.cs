namespace CloudflightEnvironment
{
    abstract class Level
    {
        public int LevelNumber { get; private set; }
        public string FolderPath { get; private set; }
        public string[] input { get; set; }
        public Level(int levelNumber)
        {
            LevelNumber = levelNumber;
            FolderPath = $"../../../level-{levelNumber}/";
            input = File.ReadAllLines(FolderPath + $"in_level-{levelNumber}_0-example.txt");
        }

        public abstract List<string> Solve();

        public void WriteOutput(string number)
        {
            File.WriteAllLines(FolderPath + $"level{LevelNumber}_{number}.out", Solve());
        }
        public void ShowConsole()
        {
            List<string> strings = Solve();
            foreach (var item in strings)
            {
                Console.WriteLine(item);
            }
        }

        public void SolveAll()
        {
            //for(int i = 1; i <= 5; i++)
            //{
            //    input = File.ReadAllLines(FolderPath + $"level{LevelNumber}_{i}.in");
            //    WriteOutput(i.ToString());
            //}
            
            input = File.ReadAllLines(FolderPath + $"in_level-{LevelNumber}_1-small.txt");
            WriteOutput("1_small".ToString());

            input = File.ReadAllLines(FolderPath + $"in_level-{LevelNumber}_2-medium.txt");
            WriteOutput("2_medium".ToString());

            input = File.ReadAllLines(FolderPath + $"in_level-{LevelNumber}_3-large.txt");
            WriteOutput("3_large".ToString());

            input = File.ReadAllLines(FolderPath + $"in_level-{LevelNumber}_4-enormous.txt");
            WriteOutput("4_enormous".ToString());

        }
    }
}
