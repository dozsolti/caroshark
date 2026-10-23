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
                int init = radius;
                
                int indent = radius;


                while (indent >= 0)
                {
                    StringBuilder sb = new StringBuilder();
                    for (int y = 0; y < indent; y++)
                    {
                        sb.Append("-");
                    }
                    if (indent == radius)
                    {
                        for (int y = 0; y < radius + 1; y++)
                        {
                            sb.Append("*-");
                        }
                    }
                    else
                    {
                        sb.Append("*-");

                        for (int y = 0; y < radius; y++)
                        {
                            sb.Append("O-");
                        }
                        sb.Append("-*");
                    }
                    for (int y = 0; y < indent - 1; y++)
                    {
                        sb.Append("-");
                    }
                    
                    result.Add(sb.ToString());
         
                    indent--;
                    radius++;
                }

                while(indent <= init)
                {
                    StringBuilder sb = new StringBuilder();
                    for (int y = 0; y < indent; y++)
                    {
                        sb.Append("-");
                    }
                    if (indent == radius)
                    {
                        for (int y = 0; y < radius + 1; y++)
                        {
                            sb.Append("*-");
                        }
                    }
                    else
                    {
                        sb.Append("*-");

                        for (int y = 0; y < radius; y++)
                        {
                            sb.Append("O-");
                        }
                        sb.Append("*");
                    }
                    for (int y = 0; y < indent - 1; y++)
                    {
                        sb.Append("-");
                    }

                    result.Add(sb.ToString());

                    indent++;
                    radius--;
                }

                result.Add(Environment.NewLine);


            }

            return result;

                


        }

    }
}
