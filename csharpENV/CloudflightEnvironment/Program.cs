using System.Text;

namespace CloudflightEnvironment
{
    internal class Program
    {
        static void Main(string[] args)
        {
            //Level solver = new Level6();

            //solver.ShowConsole();

            //solver.SolveAll();

            int rad = 30;
            List<string> strings = GetOptimumFill(rad);

            Console.WriteLine(string.Join("\n", strings));
        }

        static List<string> GetOptimumFill(int radius)
        {
            List<string> result = new List<string>();
            

            if(radius == 1)
            {
                result.Add("- - - - - -");
                throw new Exception("Radius must be greater than 0");
            }

            if(radius == 2)
            {
                result.Add("- - - - - -");
                result.Add("B B B B B B");
                return result;
            }

            if(radius == 3)
            {
                result.Add("- - - - - -");
                result.Add("B B B B B B");
                return result;
            }

            if(radius == 4)
            {
                result.Add("- - - - - -");
                result.Add("B B B B B B");
                result.Add("B B B B B B");
                result.Add("B B B B B B");
                result.Add("- F - F - F");
                result.Add("F B F B F B");
                return result;
            }

            if (radius == 5) 
            {
                var four = GetOptimumFill(4);
                result.AddRange(four);
                result.Add("B B B B B B");
                result.Add("B F B F B F");
                result.Add("- B - B - B");
                return result;
            }

            if (radius == 6) 
            {
                var five = GetOptimumFill(5);
                result.AddRange(five);
                result.Add("B F B F B F");
                result.Add("- B - B - B");
                result.Add("- B - B - B");
                result.Add("F - F - F -");
                result.Add("F - F - F -");
                return result;
            }

            int currentRadius = 6;
            int step = 2;

            var six = GetOptimumFill(6);
            result.AddRange(six);

            var evenStart = "B B B B B B";
            var oddStart = "B - B - B -";
            while (true)
            {
                if (currentRadius % 2 == 0) 
                {
                    result.Add(evenStart);
                    for(int i = 0; i < step; i++)
                    {
                        result.Add("B - B - B -");
                    }
                    for (int i = 0; i < step; i++)
                    {
                        result.Add("- F - F - F");
                    }
                    currentRadius++;
                    if(currentRadius == radius)
                    {
                        break;
                    }
                }
                else
                {
                    result.Add(oddStart);
                    step++;
                    for (int i = 0; i < step; i++)
                    {
                        result.Add("- B - B - B");
                    }
                    for (int i = 0; i < step; i++)
                    {
                        result.Add("F - F - F -");
                    }
                    currentRadius++;
                    if (currentRadius == radius)
                    {
                        break;
                    }
                }
            }

            if(currentRadius % 2 == 0)
            {
                result.Add("B - B - B -");
            }

            return result;

        }
    }
}
