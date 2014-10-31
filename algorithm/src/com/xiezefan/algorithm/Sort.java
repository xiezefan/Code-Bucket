package com.xiezefan.algorithm;

public class Sort {
	public static int index = 1;
	
	//快速排序
	public static void quickSort(int[] list, int left, int right) {
		if (left < right) {
			int key = list[left];
			int low = left;
			int high = right;
			while (low < high) {
				//这里一定要有等于号
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
			
			/*----print start----*/
			System.out.print("第 " + Sort.index++ +  " 排序");
			for (int i : list) {
				System.out.print(i + " ");
			}
			System.out.println("");
			/*----print end----*/
			
			Sort.quickSort(list, left, low - 1);
			Sort.quickSort(list, low + 1, right);
		}
	}
	
	//堆排序
	public static void build_head(int[] list, int length) {
        int begin = length / 2 + 1;
        for (int i=begin; i>=0; i--) {
            adjust_heap(list, length, i);
        }
	}
	
	public static void adjust_heap(int[] list, int length, int i) {
        int left = 2 * i;
        int right = 2 * i + 1;
        int largest = i;
        int temp;


        //TODO 查为什么是或操作
        while (left < right && right < length) {
            if (left < right && list[largest] < list[left]) {
                largest = left;
            }
            if (left < right && list[largest] < list[right]) {
                largest = right;
            }

            if (i != largest) {
                temp = list[largest];
                list[largest] = list[i];
                list[i] = temp;

                i = largest;
                left = largest * 2;
                right = largest * 2 + 1;

            } else {
                //i已经为该 子树 最大的点
                break;
            }
        }

	}

    public static void head_sort(int[] list) {
        int length = list.length;
        int temp;
        int index = 0;
        printList(list, index++);
        build_head(list, length);

        while (length > 1) {
            temp = list[0];
            list[0] = list[length-1];
            list[length-1] = temp;
            length--;
            printList(list, index++);
            adjust_heap(list, length, 0);
        }
        printList(list, index++);


    }

    //归并排序
    public static void mergeArray(int[] list, int left, int mid, int right, int[] temp) {
        int k = 0;
        int i = left, j = mid + 1;

        while (i <= mid && j <= right) {
            if (list[i] <= list[j]) {
                temp[k++] = list[i++];
            } else {
                temp[k++] = list[j++];
            }
        }

        while (i <= mid) {
            temp[k++] = list[i++];
        }

        while (j <= right) {
            temp[k++] = list[j++];
        }

        for (i=left; i<=right; i++) {
            list[i] = temp[i - left];
        }
    }

    public static void mergeSort(int[] list, int left, int right, int[] temp) {

        if (left < right) {
            int mid = (right + left) / 2;
            mergeSort(list, left, mid, temp);
            mergeSort(list, mid + 1, right, temp);
            mergeArray(list, left, mid, right, temp);
        }

    }

    public static void printList(int[] list, int index) {
        System.out.print("第 " + index +  " 排序");
        for (int i : list) {
            System.out.print(i + " ");
        }
        System.out.println("");
    }
	
	
	public static void main(String[] args) {
		int[] list = {34, 1, 23, 44, 23, 56, 12, 42, 32};
		
		//Sort.quicksort(list, 0, list.length-1);
        //Sort.head_sort(list);
        Sort.mergeSort(list, 0, list.length - 1, new int[list.length]);
        printList(list, 1);
		System.out.println("success");
		
	}
}
