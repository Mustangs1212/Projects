import javax.swing.*;
import java.awt.*;

public class BoardPanel extends JPanel {
    private final String[] puzzle = {
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
    };

    private final String[] solution = {
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
    };

    private ButtonsPanel buttonsPanel;
    private JLabel topText;

    private int errors = 0;

    BoardPanel(ButtonsPanel buttonsPanel, JLabel topText) {
        this.setLayout(new GridLayout(9,9));
        this.buttonsPanel = buttonsPanel;
        this.topText = topText;
        setupTiles();

    }

    private void setupTiles() {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                Tile tile = new Tile(r,c);
                char tileChar = puzzle[r].charAt(c);
                tile.setFont(new Font("Arial",Font.BOLD,20));
                if(tileChar != '-') {
                    tile.setText(String.valueOf(tileChar));
                    tile.setBackground(Color.DARK_GRAY);
                    tile.setForeground(Color.LIGHT_GRAY);
                } else {
                    tile.setBackground(Color.lightGray);
                    tile.setForeground(Color.DARK_GRAY);
                }

                if ((r == 2 && c == 2) || (r == 2 && c == 5) || (r == 5 && c == 2) || (r == 5 && c == 5)) {
                    tile.setBorder(BorderFactory.createMatteBorder(1,1,5,5,Color.BLACK));
                } else if (r == 2 || r == 5) {
                    tile.setBorder(BorderFactory.createMatteBorder(1,1,5,1,Color.BLACK));
                } else if (c == 2 || c == 5) {
                    tile.setBorder(BorderFactory.createMatteBorder(1,1,1,5,Color.BLACK));
                } else {
                    tile.setBorder(BorderFactory.createLineBorder(Color.BLACK));
                }
                tile.setFocusable(false);
                this.add(tile);

                tile.addActionListener(e -> {
                    Tile tile1 = (Tile) e.getSource();
                    int r1 = tile1.getR();
                    int c1 = tile1.getC();

                    JButton numSelected = buttonsPanel.getNumSelected();

                    if (numSelected != null && tile1.getText().isEmpty()) {
                        String numSelectedText = numSelected.getText();
                        String tileSolution = String.valueOf(solution[r1].charAt(c1));

                        if (tileSolution.equals(numSelectedText)) {
                            tile1.setText(numSelectedText);
                        } else {
                            errors++;
                            topText.setText("Sudoku: " + errors);
                        }
                    }
                });
            }
        }
    }
}
