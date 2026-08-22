import java.awt.*;

public class Paddle {
    private int x, y;
    private final int upKey, downKey;
    private boolean upPressed = false, downPressed = false;

    public Paddle(int x, int y, int upKey, int downKey) {
        this.x = x;
        this.y = y;
        this.upKey = upKey;
        this.downKey = downKey;
    }

    public void draw(Graphics g) {
        g.setColor(Color.white);
        g.fillRect(x, y, Constants.PADDLE_WIDTH, Constants.PADDLE_HEIGHT);
    }

    public void move() {
        if (upPressed && y > 0) y -= Constants.PADDLE_SPEED;
        if (downPressed && y < Constants.GAME_HEIGHT - Constants.PADDLE_HEIGHT) y += Constants.PADDLE_SPEED;
    }

    public Rectangle getBounds() {
        return new Rectangle(x, y, Constants.PADDLE_WIDTH, Constants.PADDLE_HEIGHT);
    }

    public int getUpKey() {
        return upKey;
    }

    public int getDownKey() {
        return downKey;
    }

    public void setUpPressed(boolean pressed) {
        this.upPressed = pressed;
    }

    public void setDownPressed(boolean pressed) {
        this.downPressed = pressed;
    }
}
