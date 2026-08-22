import javax.swing.*;
import java.awt.*;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Sudoku");
        frame.setLayout(new BorderLayout());
        frame.setSize(600,650);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);
        frame.setLocationRelativeTo(null);

        TopPanel topPanel = new TopPanel();
        frame.add(topPanel, BorderLayout.NORTH);
        ButtonsPanel buttonsPanel = new ButtonsPanel();
        frame.add(buttonsPanel, BorderLayout.SOUTH);
        BoardPanel boardPanel = new BoardPanel(buttonsPanel, topPanel.getTopText());
        frame.add(boardPanel, BorderLayout.CENTER);


        frame.setVisible(true);

    }
}