/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <iostream>
#include <string>
#include <array>
#include <vector>

using namespace std;

int calculateWinner(const vector<vector<int>> &field) {
	for (int i = 0; i < field.size(); i++) {
		if(field.at(0).at(i) != 0 &&  field.at(0).at(i) == field.at(1).at(i) && field.at(1).at(i) == field.at(2).at(i)) {
			return field.at(0).at(i);
		} else if (field.at(i).at(0) != 0 && field.at(i).at(0) == field.at(i).at(1) && field.at(i).at(1) == field.at(i).at(2)) {
			return field.at(i).at(0);
		}
	}

	if (field.at(0).at(0) != 0 && field.at(0).at(0) == field.at(1).at(1) && field.at(1).at(1) == field.at(2).at(2)) {
		return field.at(1).at(1);
	} else if (field.at(0).at(2) != 0 && field.at(0).at(2) == field.at(1).at(1) && field.at(1).at(1) == field.at(2).at(0)) {
		return field.at(1).at(1);
	}
	return 0;
}

int main()
{
	// There are player 1 and 2. 0 stands for space!
	vector<vector<int>> field {
	    {0,0,1},
	    {0,1,0},
	    {1,0,1}
	};
	for (const auto &raw : field) {
	    cout<<"|";
	    for (const auto &item : raw) {
	        cout<< item <<"|";
	    }
	    cout<<endl;
	}
	
	cout<< "The Winner is: " << calculateWinner(field);

	return 0;
}
