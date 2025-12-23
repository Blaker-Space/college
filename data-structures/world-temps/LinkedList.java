
public class LinkedList {

	private reading head = null;
	private reading tail = null;
	private reading current = null;
	private int count = 0;

	public void add (reading element) {
		if (head == null) {

			head = element;
			current = head;
			tail = head;
		}
		else {
			tail.setNext(element);
			tail = element;
		}
		count++;

	}

	public void delete (int index) {
		current = getNth(index-1);
		current.setNext(current.getNext().getNext());
		count--;
	}

	public reading getFirst() {
		return head;
	}

	public reading getLast() {
		return tail;
	}

	public void resetCurrent() {
		current = head;
	}

	public int getCount() {
		return count;
	}

	public reading getNextElement() {
		reading c = current;
		if(current!=null) {
			current=current.getNext();
		}
		else {
			return null;
		}
		return c;
	}

	public reading getNth(int index) {
		reading answer = null;
		current = head;
		for(int i=1;i<=index;i++) {
			answer = getNextElement();
		}
		return answer;
	}

	public void list() {
		current = head;
		for(int i=1;i<=count;i++) {
			System.out.println(current);
		}
	}
}
