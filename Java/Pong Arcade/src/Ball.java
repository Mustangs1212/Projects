import java.awt.*;
import java.util.Random;

public class Ball {
    private int x, y;
    private int xVelocity, yVelocity;
    private final int SIZE = Constants.BALL_SIZE;

    public Ball() {
        reset();
    }

    private void reset() {
        x = Constants.GAME_WIDTH / 2 - SIZE / 2;
        y = Constants.GAME_HEIGHT / 2 - SIZE / 2;

        Random random = new Random();
        xVelocity = random.nextBoolean() ? 4 : -4;
        yVelocity = random.nextInt(3) + 2;
        yVelocity *= random.nextBoolean() ? 1 : -1;
    }

    public void draw(Graphics g) {
        g.setColor(Color.white);
        g.fillOval(x, y, SIZE, SIZE);
    }

    public void move() {
        x += xVelocity;
        y += yVelocity;

        if (y <= 0 || y >= Constants.GAME_HEIGHT - SIZE) {
            yVelocity *= -1;
        }
    }

    public void checkCollision(Paddle p1, Paddle p2, Score score) {
        if (getBounds().intersects(p1.getBounds()) || getBounds().intersects(p2.getBounds())) {
            xVelocity *= -1;
        }

        if (x <= 0) {
            score.incrementPlayer2();
            reset();
        } else if (x >= Constants.GAME_WIDTH - SIZE) {
            score.incrementPlayer1();
            reset();
        }
    }

    public Rectangle getBounds() {
        return new Rectangle(x, y, SIZE, SIZE);
    }
}
