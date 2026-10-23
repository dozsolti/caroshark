using System.Text;

namespace CloudflightEnvironment
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Level solver = new Level5();

            solver.ShowConsole();

            solver.SolveAll();
        }
    }
}
