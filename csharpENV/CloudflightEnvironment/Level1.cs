using System.Runtime.CompilerServices;

namespace CloudflightEnvironment
{
    class Level1 : Level
    {
        public Level1() : base(1) { }
        public override List<string> Solve()
        {
            var result = new List<string>();

            for(int l = 1; l < input.Length; l++)
            {
                int radius = int.Parse(input[l]);

                for (int row = 0; row < 2 * radius + 1; row++)
                {
                    int distance = Math.Abs(radius - row);
                    int cellCount = radius + 2 - distance;

                    string line =
                        new string('-', distance) +
                        "*" +
                        string.Join("", new string('O', cellCount)
                            .ToCharArray()) +
                        "*";

                    result.Add(line);
                }

                result.Add('');
            }

            return result;


        }

    }
}
