import java.awt.*;

public class Score {
    private int player1Score = 0;
    private int player2Score = 0;

    public void incrementPlayer1() {
        player1Score++;
    }

    public void incrementPlayer2() {
        player2Score++;
    }

    public void draw(Graphics g) {
        g.setColor(Color.white);
        g.setFont(new Font("Consolas", Font.PLAIN, 30));
        g.drawString("Player 1: " + player1Score, 50, 30);
        g.drawString("Player 2: " + player2Score, Constants.GAME_WIDTH - 200, 30);
    }
}
