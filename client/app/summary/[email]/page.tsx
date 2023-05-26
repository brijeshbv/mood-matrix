import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockData = {
  "storchaka@gmail.com": {
    intermediate_steps: [
      "\nPetr Viktorin proposed that the code object constructor should have an optional parameter for posonlyargcount, and that co_argcount should mean the number of positional parameters. Pablo quickly fixed two bugs related to handling positional-only arguments.",
      "\nThis contribution fixed the UTF-8 and UTF-16 incremental decoders, making the UTF-8 incremental decoders fail faster when encountering a sequence that cannot be handled by the error handler, and making the UTF-16 incremental decoders with the surrogatepass error handler decode a lone low surrogate with final=False.",
      "\nThis contribution tested the math.comb() and math.perm() functions for OverflowError only on CPython. Other implementations may raise MemoryError, but this could take hours.",
      "\nThis pull request deprecates the acceptance of floats in the math.factorial() function.",
      "\nThis contribution suggests not using explicit inheritance from object when creating documentation.",
      "\n            bpo-37116: Added PEP 570 syntax for positional-only parameters in Python 3.9 (GH-12620). Turned deprecation warnings in Python 3.8 into TypeErrors.",
      "\nThis pull request adds a new function, math.perm(), to the Python math module. This function allows users to calculate the number of permutations of a given set of objects.",
      "\nThis contribution adds additional tests to the marshal module to ensure that identity is preserved when marshalling data.",
      "\nThis pull request adds the ability to use the __index__ attribute in the constructors of int, float and complex.",
      "\n    This pull request refactored the implementation of math.comb(), fixed some bugs, added support for index-likes objects, improved error messages, cleaned up and optimized the code, and added more tests.",
      "\nThis contribution adds more PEP 570 syntax to the documentation, making it easier to read and understand.",
      "\n            This contribution implements the PEP 570 syntax for positional-only parameters in Python, allowing for more flexibility in function definitions.",
    ],
    items: [
      {
        content:
          'Subject: [Python-Dev] Expected stability of PyCode_New() and\n types.CodeType() signatures\n\n\n31.05.19 11:46, Petr Viktorin ????:\n> PEP 570 (Positional-Only Parameters) changed the signatures of \n> PyCode_New() and types.CodeType(), adding a new argument for "posargcount".\n> Our policy for such changes seems to be fragmented tribal knowledge. I\'m \n> writing to check if my understanding is reasonable, so I can apply it \n> and document it explicitly.\n> \n> There is a surprisingly large ecosystem of tools that create code objects.\n> The expectation seems to be that these tools will need to be adapted for \n> each minor version of Python.\n\nI have a related proposition. Yesterday I have reported two bugs (and \nPablo quickly fixed them) related to handling positional-only arguments. \nThese bugs were occurred due to subtle changing the meaning of \nco_argcount. When we make some existing parameters positional-only, we \ndo not add new arguments, but mark existing parameters. But co_argcount \nnow means the only number of positional-or-keyword parameters. Most code \nwhich used co_argcount needs now to be changed to use \nco_posonlyargcount+co_argcount.\n\nI propose to make co_argcount meaning the number of positional \nparameters (i.e. positional-only + positional-or-keyword). This would \nremove the need of changing the code that uses co_argcount.\n\nAs for the code object constructor, I propose to make posonlyargcount an \noptional parameter (default 0) added after existing parameters. \nPyCode_New() can be kept unchanged, but we can add new PyCode_New2() or \nPyCode_NewEx() with different signature.\n\n',
        time: 1559314933,
        time_spent: 4,
        type: "email",
      },
      {
        content:
          "    bpo-24214: Fixed the UTF-8 and UTF-16 incremental decoders. (GH-14304)\n    \n    * The UTF-8 incremental decoders fails now fast if encounter\n      a sequence that can't be handled by the error handler.\n    * The UTF-16 incremental decoders with the surrogatepass error\n      handler decodes now a lone low surrogate with final=False.",
        time: 1561452858,
        time_spent: 43,
        type: "git_log",
      },
      {
        content:
          "    bpo-35431: Test math.comb() and math.perm() for OverflowError only on CPython. (GH-14146)\n    \n    Other implementation can raise MemoryError, but it can takes hours.",
        time: 1560779912,
        time_spent: 56,
        type: "git_log",
      },
      {
        content:
          "    bpo-37315: Deprecate accepting floats in math.factorial(). (GH-14147)",
        time: 1560779847,
        time_spent: 67,
        type: "git_log",
      },
      {
        content:
          "    Do not use explicit inheritance from object in the documentation. (GH-13936)",
        time: 1560162952,
        time_spent: 74,
        type: "git_log",
      },
      {
        content:
          "    [3.9] bpo-37116: Use PEP 570 syntax for positional-only parameters. (GH-12620)\n    \n    Turn deprecation warnings added in 3.8 into TypeError.",
        time: 1559748151,
        time_spent: 66,
        type: "git_log",
      },
      {
        content: "    bpo-37128: Add math.perm(). (GH-13731)",
        time: 1559463409,
        time_spent: 71,
        type: "git_log",
      },
      {
        content:
          "    Add more tests for preserving identity in marshal. (GH-13736)",
        time: 1559455439,
        time_spent: 79,
        type: "git_log",
      },
      {
        content:
          "    bpo-20092. Use __index__ in constructors of int, float and complex. (GH-13108)",
        time: 1559423148,
        time_spent: 90,
        type: "git_log",
      },
      {
        content:
          "    bpo-35431: Refactor math.comb() implementation. (GH-13725)\n    \n    * Fixed some bugs.\n    * Added support for index-likes objects.\n    * Improved error messages.\n    * Cleaned up and optimized the code.\n    * Added more tests.",
        time: 1559416142,
        time_spent: 72,
        type: "git_log",
      },
      {
        content: "    Use more PEP 570 syntax in the documentation. (GH-13720)",
        time: 1559378304,
        time_spent: 42,
        type: "git_log",
      },
      {
        content:
          "    bpo-37116: Use PEP 570 syntax for positional-only parameters. (GH-13700)",
        time: 1559376015,
        time_spent: 98,
        type: "git_log",
      },
    ],
    output_text:
      "\nThis pull request adds PEP 570 syntax for positional-only parameters in Python 3.9, fixes deprecation warnings in Python 3.8, tests the math.comb() and math.perm() functions, deprecates the acceptance of floats in the math.factorial() function, suggests not using explicit inheritance from object when creating documentation, adds a new math.perm() function, adds additional tests to the marshal module, adds the ability to use the __index__ attribute in the constructors of int, float and complex, refactors the implementation of math.comb(), fixes bugs, adds support for index-likes objects, improves error messages, cleans up and optimizes the code, and adds more tests and documentation for PEP 570 syntax.",
  },
}

export default function Page({ params }: { params: { email: string } }) {
  console.log(params.email)
  return (
    <div className="pt-4">
      <div className="flex flex-1 flex-row text-center">
        <h1 className="pb-4 text-3xl font-extrabold leading-tight  tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Summary for {decodeURIComponent(params.email)}
        </h1>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Time Spent</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData["storchaka@gmail.com"].items.map((item) => (
            <TableRow>
              <TableCell className="font-medium">{item.content}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.time_spent}</TableCell>
              <TableCell>{item.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
