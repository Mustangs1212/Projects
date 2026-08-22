import javax.swing.*;

public class Tile extends JButton {

    private int r;
    private int c;

    Tile(int r, int c) {
        this.r = r;
        this.c = c;
    }

    public int getR() {
        return r;
    }

    public int getC() {
        return c;
    }
}
