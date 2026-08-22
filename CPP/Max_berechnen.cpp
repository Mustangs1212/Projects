/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/

// Get maximum of (max) 4 int, while using overloading
#include <iostream>

using namespace std;

int maximum(int a, int b) {
    
    if (a > b) {
        return a;
    }
    return b;
}

int maximum(int a, int b, int c) {
    int i = maximum(a,b);
    if (i > c) {
        return i;
    }
    return c;
}

int maximum(int a, int b, int c, int d) {
    int i = maximum(a,b,c);
    if (i > d) {
        return i;
    }
    return d;
}



int main()
{
    cout << maximum(21,15,20);
    return 0;
}
