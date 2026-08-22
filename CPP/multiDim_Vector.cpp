
/* 
Magische Vectoren (mehrdimensional)
In dieser Lektion möchten wir den Umgang mit mehrdimensionale Vectoren üben.

Implementiere eine Funktion, die true zurückgibt, wenn der Vector magisch ist, und false, wenn nicht. 

Ein magischer Vektor ist beispielsweise dieser Vektor, da die Summe der inneren Vektoren identisch ist:

{{2,2,5,1},{5,5},{7,2,1}} 

2+ 2 + 5 + 1 = 10 für {2,2,5,1} 
5 + 5 = 10 für {5,5} 
7 + 2 + 1 = 10 für {7,2,1} 

*/
#include <vector>
#include <string>
#include <iostream>

using namespace std;

bool is_magic(const vector<vector<int>> &ma) {
    // add your code below...
    vector<int> innereSumme;
    for (const auto &raw : ma) {
        int sum = 0;
        for (const auto &num : raw) {
            sum += num;
        }
        innereSumme.push_back(sum);
    }
    
    int count = innereSumme.front();
    for (const auto &check : innereSumme) {
        if (check != count) {
            return false;
        }
    }
    return true;
    
}


int main(int argc, const char * argv[]) {
    cout << is_magic({{2,2,5,1},{5,5},{7,2,1}}) << endl;
    cout << is_magic({{2,2,5,1},{5,5, 4},{7,2,1}}) << endl;
}

