
import java.util.Arrays;

class Solution {
    public String largestNumber(int[] nums) {

        String[] numbers = new String[nums.length];

        for (int i = 0; i < nums.length; i++) {
            numbers[i] = String.valueOf(nums[i]);
        }

        Arrays.sort(numbers, (a, b) -> 
            (b + a).compareTo(a + b)
        );

        if (numbers[0].equals("0")) {
            return "0";
        }

        StringBuilder result = new StringBuilder();

        for (String number : numbers) {
            result.append(number);
        }

        return result.toString();
    }
}
