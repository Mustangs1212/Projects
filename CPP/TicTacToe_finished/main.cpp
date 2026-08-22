#include <iostream>
#include <string>
#include <vector>

#include "TicTacToeField.h"
#include "TicTacToeGame.h"

using namespace std;


int main(int argc, const char * argv[]) {
    
    TicTacToeGame g("Felix", "Franz");
    cout << g.getFieldStr() << endl;
    
    while (!g.isFinished()) {
        cout << "Spieler " << g.getCurrentPlayer() << " ist dran. Bitte gebe deine gewünschte Position ein:" << endl;
        int row, col;
        
        cin >> row >> col;
        g.play(row, col);
        
        cout << g.getFieldStr() << endl;
    }
    
    cout << "Der Gewinner ist: " << g.getWinner() << endl;
    

    
    
    
}
