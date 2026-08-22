/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <string>
#include <iostream>

using namespace std;

bool palindrome(string word) {
    // Schreibe deinen Code hier!
    for (int i = 0; i < word.length() / 2; i++) {
        if(word[i] != word[word.length() - i - 1]) {
            return false;
        }
    }
    return true;
}


int main()
{
    cout << palindrome("ABBA") << endl;
    cout << palindrome("REITTIER") << endl;
    cout << palindrome("KEINPALINDROME") << endl;
    return 0;
}