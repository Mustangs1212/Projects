import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class GamePanel extends JPanel implements Runnable {

    Paddle player1, player2;
    Ball ball;
    Score score;
    Thread gameThread;

    public GamePanel() {
        this.setPreferredSize(new Dimension(Constants.GAME_WIDTH, Constants.GAME_HEIGHT));
        this.setFocusable(true);
        this.setBackground(Color.black);
        this.setDoubleBuffered(true);

        initGame();         // 🟢 Initialize game objects FIRST
        addKeyBindings();   // 🔵 THEN add key bindings

        gameThread = new Thread(this);
        gameThread.start();
    }

    private void initGame() {
        player1 = new Paddle(0, Constants.GAME_HEIGHT / 2 - Constants.PADDLE_HEIGHT / 2, KeyEvent.VK_W, KeyEvent.VK_S);
        player2 = new Paddle(Constants.GAME_WIDTH - Constants.PADDLE_WIDTH,
                Constants.GAME_HEIGHT / 2 - Constants.PADDLE_HEIGHT / 2, KeyEvent.VK_UP, KeyEvent.VK_DOWN);
        ball = new Ball();
        score = new Score();
    }

    private void addKeyBindings() {
        InputMap im = this.getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW);
        ActionMap am = this.getActionMap();

        for (Paddle p : new Paddle[]{player1, player2}) {
            im.put(KeyStroke.getKeyStroke(p.getUpKey(), 0, false), p.getUpKey() + "pressed");
            im.put(KeyStroke.getKeyStroke(p.getDownKey(), 0, false), p.getDownKey() + "pressed");
            im.put(KeyStroke.getKeyStroke(p.getUpKey(), 0, true), p.getUpKey() + "released");
            im.put(KeyStroke.getKeyStroke(p.getDownKey(), 0, true), p.getDownKey() + "released");

            am.put(p.getUpKey() + "pressed", new AbstractAction() {
                public void actionPerformed(ActionEvent e) {
                    p.setUpPressed(true);
                }
            });
            am.put(p.getDownKey() + "pressed", new AbstractAction() {
                public void actionPerformed(ActionEvent e) {
                    p.setDownPressed(true);
                }
            });
            am.put(p.getUpKey() + "released", new AbstractAction() {
                public void actionPerformed(ActionEvent e) {
                    p.setUpPressed(false);
                }
            });
            am.put(p.getDownKey() + "released", new AbstractAction() {
                public void actionPerformed(ActionEvent e) {
                    p.setDownPressed(false);
                }
            });
        }
    }

    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        draw(g);
    }

    private void draw(Graphics g) {
        player1.draw(g);
        player2.draw(g);
        ball.draw(g);
        score.draw(g);
    }

    private void move() {
        player1.move();
        player2.move();
        ball.move();
    }

    private void checkCollision() {
        ball.checkCollision(player1, player2, score);
    }

    @Override
    public void run() {
        long lastTime = System.nanoTime();
        double amountOfTicks = 60.0;
        double nsPerTick = 1_000_000_000 / amountOfTicks;
        double delta = 0;

        while (true) {
            long now = System.nanoTime();
            delta += (now - lastTime) / nsPerTick;
            lastTime = now;

            if (delta >= 1) {
                move();
                checkCollision();
                repaint();
                delta--;
            }
        }
    }
}
