import javax.swing.*;
import java.awt.*;

public class BoardPanel extends JPanel {

    JButton[][] board = new JButton[3][3];
    String playerX = "X";
    String playerO = "O";
    String currentPlayer = playerX;
    JLabel text;
    boolean gameOver = false;
    int turn = 0;

    BoardPanel(JLabel text1) {
        this.setLayout(new GridLayout(3,3));
        text = text1;
        for (int r = 0; r < 3; r++) {
            for (int c = 0; c < 3; c++) {
                JButton tile = new JButton();
                board[r][c] = tile;
                this.add(tile);
                tile.setBackground(Color.DARK_GRAY);
                tile.setForeground(Color.WHITE);
                tile.setFont(new Font("Arial", Font.BOLD, 120));

                tile.addActionListener(e -> {
                    JButton tiles = (JButton) e.getSource();
                    if (tiles.getText().isEmpty()) {
                        tiles.setText(currentPlayer);
                        turn++;
                        checkWinner();
                        if (!gameOver) {
                            currentPlayer = currentPlayer.equals(playerX) ? playerO : playerX;
                            text.setText(currentPlayer + "'s turn");
                        }
                    }
                });
            }
        }
    }

    private void checkWinner() {
        // Horizontal
        for (int r = 0; r < 3; r++) {
            if(board[r][0].getText().isEmpty()){continue;}
            if(board[r][0].getText().equals(board[r][1].getText()) &&
                board[r][0].getText().equals(board[r][2].getText())) {
                gameOver = true;
                for (int i = 0; i < 3; i++) {
                    setWinner(board[r][i]);
                }
                return;
            }
        }

        // Vertical
        for (int c = 0; c < 3; c++) {
            if(board[0][c].getText().isEmpty()){continue;}
            if(board[0][c].getText().equals(board[1][c].getText()) &&
                    board[0][c].getText().equals(board[2][c].getText())) {
                gameOver = true;
                for (int i = 0; i < 3; i++) {
                    setWinner(board[i][c]);
                }
                return;
            }
        }

        // Diagonally
        if (!board[0][0].getText().isEmpty() && board[0][0].getText().equals(board[1][1].getText()) && board[0][0].getText().equals(board[2][2].getText())) {
            for (int i = 0; i < 3; i++) {
                setWinner(board[i][i]);
            }
            gameOver = true;
            return;
        }

        // Anti-Diagonally
        if (!board[0][2].getText().isEmpty() && board[0][2].getText().equals(board[1][1].getText()) && board[1][1].getText().equals(board[2][0].getText())) {
            setWinner(board[0][2]);
            setWinner(board[1][1]);
            setWinner(board[2][0]);
            gameOver = true;
            return;
        }
        if (turn == 9) {
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    setTie(board[i][j]);
                }
            }
            text.setText("Tie");
            text.setBackground(Color.pink);
            gameOver = true;
        }
    }

    private void setWinner(JButton tile) {
        tile.setForeground(Color.GREEN);
        tile.setBackground(Color.ORANGE);
        text.setText(currentPlayer + " is the winner");

    }

    private void setTie(JButton tile) {
        tile.setBackground(Color.pink);
        tile.setForeground(Color.GREEN);
    }
}
