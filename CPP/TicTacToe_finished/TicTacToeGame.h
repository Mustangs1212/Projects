
#pragma once

#include <string>

#include "TicTacToeField.h"

class TicTacToeGame : public TicTacToeField
{
private:
    std::string player1_;
    std::string player2_;
    int currentPlayer_;
    
public:
    
    TicTacToeGame(std::string player1, std::string player2);
    bool isFinished();
    void play(int row, int col);
    
    std::string getWinner();
    std::string getCurrentPlayer();
    std::string getFieldStr();
};
