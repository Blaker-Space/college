import java.util.Random;
import java.util.Scanner;

public class wargame {
    public static int maxCards = 52;
    public static Scanner s;
    public static int maxRounds = 10000;
    public static int numberOfPlayers = 4;

    public static void main(String[] args) {
        boolean running = true;
        s = new Scanner(System.in);
        Card[] deck;
        Stack[] playStack = new Stack[4];
        Stack[] winStack = new Stack[4];
        String[] playerName = new String[4];
        int[] playerRank = new int[4];
        int round = 0;
        String winner = "";

        System.out.println("**Welcome to 4-Player War!**");
        for (int i = 0; i < numberOfPlayers; i++) {
            System.out.print("Please enter the name for player " + (i+1) + ": ");
            playerName[i] = s.nextLine();
            playerRank[i]=-1;
            playStack[i] = new Stack(null);
            winStack[i] = new Stack(null);
        }

        deck = makeDeck(maxCards);
        shuffle(deck);
        System.out.println("Shuffling Deck...");
        deal(deck, playStack);
        System.out.println("Dealing Cards...");
        System.out.println("Let's play!");
        while (running) {
            System.out.print("Hit ENTER to play a round");
            s.nextLine();
            for (int i = 0; i < numberOfPlayers; i++) {
                checkEmpty(playStack[i], winStack[i], playerName[i]);
                if (playStack[i].empty() && winStack[i].empty()) {
                    System.out.printf("%s is out of cards!", playerName[i]);
                    Card sentinelCard = new Card("-1", 'n', -1);
                    playStack[i].push(sentinelCard);
                    winStack[i].push(sentinelCard);
                }
            }
            playNext(playStack, winStack, playerName);
            round++;
            if (round == maxRounds) {
                running = false;
                int mostCards = 0;
                System.out.println("\nMax Rounds reached");
                for (int i = 0; i < numberOfPlayers; i++) {
                    System.out.println("\n*** " + playerName[i] +
                            "***");
                    printStack(playStack[i]);
                    printStack(winStack[i]);
                    int totalCards = playStack[i].countCards() + winStack[i].countCards();
                    if (totalCards > mostCards) {
                        winner = playerName[i];
                        mostCards = totalCards;
                    }
                }
            }
            if (round % 5 == 0 && round != 0) {
                getPlayerRankings(playStack, winStack, playerName, playerRank);
            }
        }
        System.out.println("\nThe winner is " + winner + "in " + round +
                "rounds\nGoodbye");
        s.close();
    }

    public static void checkEmpty(Stack playDeck, Stack winStack, String player) {

        if (playDeck.empty()) {
            System.out.println("Flipping Win Stack for " + player);
            while (winStack.notEmpty()) {
                Card c = winStack.pop();
                if (c == null) {
                    return;
                }
                playDeck.push(c);
                System.out.printf("%s%s ", c.getNumber(), c.getSuit());
            }
            System.out.println("\nComplete");
            System.out.println();
        }
    }

    public static Card[] makeDeck(int maxCards) {
        Card[] deck = new Card[maxCards];
        int cardIndex = 0;
        for (int s = 0; s <= 3; s++) {
            String n;
            char suit = ' ';
            switch (s) {
                case 0: //SPADE
                    suit = '\u2660';
                    break;
                case 1: //DIAMOND:
                    suit = '\u2666';
                    break;
                case 2: //CLUB:
                    suit = '\u2663';
                    break;
                case 3: //HEART:
                    suit = '\u2665';
                    break;
            }
            for (int v = 2; v <= 14; v++) {
                if (v == 11) {
                    n = "J";
                } else if (v == 12) {
                    n = "Q";
                } else if (v == 13) {
                    n = "K";
                } else if (v == 14) {
                    n = "A";
                } else {
                    n = "" + v;
                }
                Card c = new Card(n, suit, v);
                deck[cardIndex] = c;
                cardIndex++;
            }
        }
        return deck;
    }

   /*
    public static void printDeck(Card[] d) {
        System.out.println("\nCurrent Deck\n***********");
        for (Card card : d) {
            System.out.printf("%s%s - %d\n", card.getNumber(), card.getSuit(), card.getValue());
        }
    }
*/

    public static void printStack(Stack s) { //for debugging purposes only
        System.out.println("\nCurrent Hand\n***********");
        Card c = s.pop();
        while (c != null) {
            System.out.printf("%s%s\n", c.getNumber(), c.getSuit());
            c = s.pop();
        }
    }

    public static void shuffle(Card[] deck) {
        Random rand = new Random();
        for (int i = 0; i < deck.length; i++) {
            int randomIndexToSwap = rand.nextInt(deck.length);
            Card temp = deck[randomIndexToSwap];
            deck[randomIndexToSwap] = deck[i];
            deck[i] = temp;
        }
    }

    public static void deal(Card[] deck, Stack[] playStack) {
        int current = 0;
        for (int i = 0; i < maxCards; i++) {
            playStack[current].push(deck[i]);
            current++;
            if (current == 4) {
                current = 0;
            }
        }
    }

    public static Stack playNext(Stack[] playStack, Stack[] winStack, String[] playerName) {
        Card[] playedCards = new Card[numberOfPlayers];
        //prints out cards
        for (int i = 0; i < numberOfPlayers; i++) {
            playedCards[i] = playStack[i].pop();
            System.out.printf("%s%s ", playedCards[i].getNumber(), playedCards[i].getSuit());
        }
        System.out.println();//newline

        Stack getAll = new Stack(null);
        int highestCardValue = 0;

        //finds highest card value of all cards
        for (int i = 0; i < numberOfPlayers; i++) {
            if (playedCards[i].getValue() >= highestCardValue) {
                highestCardValue = playedCards[i].getValue();
            }
        }
        int highestValueCounter = 0;
        int highestValueIndex = -1;
        //pushes cards lower than highestCardValue to getAll, increments highestValueCounter if value is equal to
        //highestCardValue to check for ties
        for (int i = 0; i < numberOfPlayers; i++) {
            if (playedCards[i] != null && playedCards[i].getValue() < highestCardValue) {
                getAll.push(playedCards[i]);
                playedCards[i] = null;
            } else if (playedCards[i] != null) {
                highestValueCounter++;
                highestValueIndex = i;
            }
        }
        if (highestValueCounter == 1) {
            switch (highestValueIndex) {
                case 0:
                    System.out.println("^");
                    break;
                case 1:
                    System.out.println("   ^");
                    break;
                case 2:
                    System.out.println("      ^");
                    break;
                case 3:
                    System.out.println("         ^");
                    break;
                default:
                    System.out.println("Error with highestValueCounter variable");
            }
        }
        while (highestValueCounter > 1) {
            System.out.println("**BATTLE**");
            for (int i = 0; i < numberOfPlayers; i++) {
                if (playedCards[i] != null) {
                    checkEmpty(playStack[i], winStack[i], playerName[i]);
                    if (playStack[i] == null) {
                        System.out.printf("%s has no more cards to finish the war!\n", playerName[i]);
                        getAll.push(playedCards[i]);
                        playedCards[i] = null;
                        highestValueCounter--;
                        break;
                    } else {
                        getAll.push(playedCards[i]);
                        playedCards[i] = playStack[i].pop();
                    }
                }
                getAll = playNext(playStack, winStack, playerName);
            }
        }

        return getAll;
    }

    public static void getPlayerRankings(Stack[] playStacks, Stack[] winStacks, String[] playerNames, int[] playerRanks) {
        int playStackValue = -1;//holds the value of the player's playStack cards
        int winStackValue = -1;//holds the value of the player's winStack cards
        int playStackCards = 0;//holds the number of cards the player has
        int winStackCards = 0;
        int[] totalCards = new int[numberOfPlayers];
        int[] cardValues = new int[numberOfPlayers];//holds the values of each player's cards at their respective index
        int highestCardValueIndex = 0;

        //output the results
        System.out.println("\n*******************");
        System.out.println("* Player Rankings *");
        System.out.println("*******************");

        //sets previously out-of-card players' cardValue to 0, newly out-of-card players cardValue to -2, and all others
        //to their regular values
        for (int i = 0; i < numberOfPlayers; i++) {
            if (playStacks[i] != null) {
                playStackValue = playStacks[i].addCards();
                playStackCards = playStacks[i].countCards();
            }
            if (winStacks[i] != null) {
                winStackValue = winStacks[i].addCards();
                winStackCards = winStacks[i].countCards();
            }
            cardValues[i] = (playStackValue + winStackValue);
            totalCards[i] = (playStackCards + winStackCards);
            if (playerRanks[i] != -1) {
                cardValues[i] = 0;
            }
        }


        for (int i = 0; i < numberOfPlayers; i++) {
            for (int j = 1; j < numberOfPlayers; j++) {
                if (cardValues[j] > cardValues[highestCardValueIndex]) {
                    highestCardValueIndex = j;
                }
            }
            playerRanks[i] = highestCardValueIndex;
            String lastDigit = Integer.toString((i + 1)).substring(Integer.toString((i + 1)).length() - 1);
            if (lastDigit.equals("1") && playerRanks[i] != 11) {
                System.out.printf("%dst place: %s - Card Value: %d; Number of Cards: %d \n", i + 1, playerNames[highestCardValueIndex],
                        cardValues[highestCardValueIndex], totalCards[i]);

            } else if (lastDigit.equals("2") && playerRanks[i] != 12) {
                System.out.printf("%dnd place: %s - Card Value: %d; Number of Cards: %d \n", i + 1, playerNames[highestCardValueIndex],
                        cardValues[highestCardValueIndex], totalCards[i]);

            } else if (lastDigit.equals("3") && playerRanks[i] != 13) {
                System.out.printf("%drd place: %s - Card Value: %d; Number of Cards: %d \n", i + 1, playerNames[highestCardValueIndex],
                        cardValues[highestCardValueIndex], totalCards[i]);

            } else {
                System.out.printf("%dth place: %s - Card Value: %d; Number of Cards: %d \n", i + 1, playerNames[highestCardValueIndex],
                        cardValues[highestCardValueIndex], totalCards[i]);
            }
            cardValues[highestCardValueIndex] = -1;
            highestCardValueIndex = 0;
        }
    }
}
