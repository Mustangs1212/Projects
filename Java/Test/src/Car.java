public class Car extends Drive {
    private int hp;
    public Car(int hp) {
        this.hp = hp;
    }
    public void carDrive() throws CarDriceException{
        if(hp == 0) {
            throw new CarDriceException();
        }
        System.out.println(hp/0);
        System.out.println("Drive!");
    }
}
