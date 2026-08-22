/******************************************************************************

Welcome to GDB Online.
GDB online is an online compiler and debugger tool for C, C++, Python, Java, PHP, Ruby, Perl,
C#, OCaml, VB, Swift, Pascal, Fortran, Haskell, Objective-C, Assembly, HTML, CSS, JS, SQLite, Prolog.
Code, Compile, Run and Debug online from anywhere in world.

*******************************************************************************/
#include <iostream>
#include <string>

using namespace std;

int main()
{
	cout<<"Please, Enter the word: "<< endl;
	string inputWord;
	cin>>inputWord;

	string out = "";
	for (int i = 0; i < inputWord.length(); i++) {
		out.append("-");
	}
	cout<<out<<endl;
	int failed = 0;
	while (failed < 5 && out.find("-") != string::npos) {
		cout<<"Take a guess: "<<endl;
		char guess;
		cin>>guess;

		if(inputWord.find(guess) == string::npos) {
			failed++;
		} else {
			for (int i = 0; i < inputWord.length(); i++) {
				if(inputWord[i] == guess) {
					out[i] = guess;
				}
			}
		}

		// Check for win
		bool win = true;

		cout<<"Remained Changes: "<< failed<<endl<<out<<endl;
	}
	if(out.find("-") == string::npos && failed != 5) {
		cout<<"Congratulatons! You have won"<<endl;

	}
	if (failed == 5) {
		cout<<"You have Lost :("<<endl;
		;
	}





	return 0;
}