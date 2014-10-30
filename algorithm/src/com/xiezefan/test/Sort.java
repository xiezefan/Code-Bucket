package com.xiezefan.test;

public class Sort {
	public static void quicksort(int[] list, int left, int right) {
		if (left < right) {
			int key = list[left];
			int low = left;
			int high = right;
			
			while (low < high) {
				while (low < high && list[high] >= key) {
					high--;
				}
				list[low] = list[high];
				
				while (low < high && list[low] < key) {
					low++;
				}
				list[high] = list[low];	
			}
			list[low] = key;
			
			Sort.quicksort(list, left, low - 1);
			Sort.quicksort(list, low + 1, right);
			
		}
	}
	
	public static void main(String[] args) {
		int[] list = {55,44,87,65,4548,32,4,32,78,5,18,56,78,35};
		Sort.quicksort(list, 0, list.length - 1);
		
		for (int i :list) {
			System.out.print(i + " ");
		}
		System.out.println();
	}
}
