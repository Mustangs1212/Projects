
#pragma once

#include <vector>
#include <string>
#include <sstream>


class TicTacToeField {
protected:
    std::vector<std::vector<int>> field;
    
public:
    TicTacToeField();
    TicTacToeField(std::vector<std::vector<int>> field);
    
    int calculateWinner();
    
    std::string getFieldStr();
    
};
