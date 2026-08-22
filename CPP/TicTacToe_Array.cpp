/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <iostream>
#include <string>
#include <array>

using namespace std;

int calculateWinner(const array<array<int,3>, 3> &field) {
	for (int i = 0; i < field.size(); i++) {
		if(field[0][i] != 0 &&  field[0][i] == field[1][i] && field[1][i] == field[2][i]) {
			return field[0][i];
		} else if (field[i][0] != 0 && field [i][0] == field[i][1] && field[i][1] == field[i][2]) {
			return field[i] [0];
		}
	}

	if (field[0][0] != 0 && field[0][0] == field[1][1] && field[1][1] == field[2][2]) {
		return field[1][1];
	} else if (field[0][2] != 0 && field[0][2] == field[1][1] && field[1][1] == field[2][0]) {
		return field[1][1];
	}
	return 0;
}

int main()
{
	// There are player 1 and 2. 0 stands for space!
	array<array<int,3>, 3> field;
	field[0] = {0,0,2};
	field[1] = {0,1,0};
	field[2] = {1,0,1};
	
	for (int i = 0; i < field.size(); i++) {
		for (int j = 0; j < field[0].size(); j++) {
			cout<< "|"<< field[i][j] << "|";
		}
		cout<<endl;
	}
	
	cout<< "The Winner is: " << calculateWinner(field);

	return 0;
}
