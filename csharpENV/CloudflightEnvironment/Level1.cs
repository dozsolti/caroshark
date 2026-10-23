namespace CloudflightEnvironment
{
    class Level1 : Level
    {
        public Level1() : base(1) { }
        public override List<string> Solve()
        {
            List<string> result = new List<string>();
            
            for(int i = 0; i < input.Length; i++)
            {
                if(i == 0)
                {
                    // Skip the first line if it contains metadata or is not needed
                    continue;
                }
                string line = input[i];
                // Process the line and generate output
                int[] ints = line.Split(' ').Select(int.Parse).ToArray();
                // Do something with the parsed integers, e.g., sum them up
                int sum = ints.Sum();
                result.Add(sum.ToString());
            }

            return result;
        }

    }
}
