
#include <iostream>
#include <string>
#include <sstream>

#include "TicTacToeGame.h"

using namespace std;

TicTacToeGame::TicTacToeGame(std::string player1, std::string player2) {
    player1_ = player1;
    player2_ = player2;
    
    currentPlayer_ = 1;
    
    cout << "New Game!" << endl;
}

void TicTacToeGame::play(int row, int col) {
    field[row][col] = currentPlayer_;
    if (currentPlayer_ == 1) {
        currentPlayer_ = 2;
    }
    else {
        currentPlayer_ = 1;
    }
}

string TicTacToeGame::getWinner() {
    if (isFinished()) {
        int winner = calculateWinner();
        if (winner == 0) {
            return "Unentschieden";
        }
        else if (winner == 1) {
            return player1_;
        }
        else {
            return player2_;
        }
    }
    return "";
}

bool TicTacToeGame::isFinished() {
    int winner = calculateWinner();
    if (winner != 0) {
        return true;
    }
    
    for (const auto &row : field) {
        for (const int &value : row) {
            if (value == 0) {
                return false;
            }
        }
    }
    
    return true;
}

string TicTacToeGame::getCurrentPlayer() {
    if (currentPlayer_ == 1) {
        return player1_;
    }
    else {
        return player2_;
    }
}

string TicTacToeGame::getFieldStr() {
    stringstream result;
    
    result << "Player 1: " << player1_ << endl;
    result << "Player 2: " << player2_ << endl;
    
    result << TicTacToeField::getFieldStr();
    
    return result.str();
}
