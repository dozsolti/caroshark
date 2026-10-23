using System.Runtime.CompilerServices;
using System.Text;

namespace CloudflightEnvironment
{
    class Level1 : Level
    {
        public Level1() : base(1) { }
        public override List<string> Solve()
        {
            var result = new List<string>();

            for (int l = 1; l < input.Length; l++)
            {
                int radius = int.Parse(input[l]);

                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < radius; i++)
                    sb.Append('-');
                for(int i = 0; i < radius +  1; i++)
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

                result.Add(Environment.NewLine);


            }

            return result;

                


        }

    }
}
