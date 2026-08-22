public class Drive implements Comparable<Drive> {
    public void driveable() {
        for (int i = 0; i < 10; i++) {
            System.out.println("Drive!");
        }
    }

    @Override
    public int compareTo(Drive o) {
        return 0;
    }
}
