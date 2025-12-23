/*Blake Mills
* COSC 3355.001
* Submission Date: 4/17/2025
*/
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <math.h>

//Define constants (number of threads, initial sum)
#define MAX_THREADS 5
#define INITIAL_SUM 2

//Data shared between threads
int *prime_numbers; //holds all prime numbers to be added up
int prime_count = 0; //holds the number of primes found
int count = 3; //current number to check for primality
sem_t count_lock; //lock for count
pthread_mutex_t prime_count_lock; //lock for prime_count variable

/* When trying to compile the program using
"gcc --std=c11 -Wall -Werror -pthread primesum.c -o primesum
I was receiving an error saying 'sqrt' was undefined.
It was able to successfully compile when I added '-lm' to the end of the command.
I built this square root function to allow it to compile without the '-lm' flag.
"*/
double get_sqrt(int num) {
    if (num < 0){
        fprintf(stderr, "Error: Negative number passed to get_sqrt\n");
        return -1;
    }

    double x = num;
    double y = 1;
    double e = 0.000000001; // precision of the final square root

    while (x - y > e) {
        x = (x + y) / 2;
        y = num / x;
    }

    return x;
}


//Function to check if any given number is prime (returns 0 if not prime, 1 if so)
int is_prime(int num) {

    // check initial cases (<= 1, == 2 )
    if (num <= 1){
        return 0;
    } 
    if(num == 2){
        return 1;
    }
    // return 0 for even numbers
    if(num % 2 == 0){
        return 0;
    }
    // check all odd numbers from 3 to the square root of num to see if n is prime
    // if compiling with -lm, use sqrt(num) instead of get_sqrt(num)
    for (int i = 3; i <= get_sqrt(num); i+= 2) {
        if (num % i == 0){
            return 0;
        }
    }
    return 1;
}

/*
* Function for producer threads. Loops until limit_number is reached.
* Checks if the current number is prime. If it is, it updates the
* prime_numbers array and increments the prime_count.
*/
void *producer(void *arg){
    int limit_number = *((int*)arg);
    int local_count;

    while(1){
        //wait for count_lock to be available
        sem_wait(&count_lock);
        local_count = count;
        
        //if we have reached the limit number, exit the loop
        if (local_count > limit_number){
            sem_post(&count_lock);
            break;
        }
        //increment count by 2 (to check only odd numbers). Free up count_lock
        count += 2;
        sem_post(&count_lock);

        // If the current number is prime, update prime_numbers
        if (is_prime(local_count)){
            //wait for prime_count_lock to be available
            pthread_mutex_lock(&prime_count_lock);
            //set the respective index in prime_numbers to the current prime number
            prime_numbers[prime_count] = local_count;
            prime_count++;
            pthread_mutex_unlock(&prime_count_lock);
        }
    }
    pthread_exit(NULL);
}

/*function for consumer thread. Waits until the count is greater than
* the limit number. Then it sums all the prime numbers in the
* prime_numbers array and prints the sum.
*/
void *consumer(void *arg){
    int sum = INITIAL_SUM;
    int limit_number = *((int*)arg);

    while(1){
        sem_wait(&count_lock);

        if(count > limit_number){
            sem_post(&count_lock);
            break;
        }
        sem_post(&count_lock);
    }
    //add up all the prime numbers in the prime_numbers array
    // up to prime_count, which was incremented each time a new
    // prime number was found
    for(int i = 0; i < prime_count; i++){
        sum += prime_numbers[i];
    }
    printf("%d\n", sum);
    pthread_exit(NULL);
}

/*This program finds the sum of all prime numbers up to a given limit (args[1]).
* It ensures only one argument is passed, converts it to an integer,
* and checks if it is less than 1. If so, it prints 0 and exits.
* If not, it sets up  a prime_numbers array, a semaphore and mutex for
* count variable (keeps track of current number up to limit_number),
* and prime_count variable (keeps track of number of primes found).
* Builds 5 producer threads and 1 consumer thread, joins them, and
* cleans up at the end of execution.
*/
int main(int argc, char *argv[]){
    //Ensure only one argument is passed
    if (argc != 2){
        fprintf(stderr, "Usage: %s <number_of_primes>\n", argv[0]);
        return 1;
    }
    //Convert the argument to an integer
    int limit_number = atoi(argv[1]);
    
    //If the limit number is less than 1, there are no primes to add up. Print 0 and exit.
    if(limit_number <= 1){
        printf("%d\n", 0);
        return 0;
    }

    //Allocate size of an integer * limit_number/2 to the prime_numbers array
    //since we are checking every other number (odd numbers) for primality
    // add 1 as a safety buffer to prevent any out of bounds errors
    prime_numbers = (int *)malloc((sizeof(int) * limit_number/2) +1);
    
    //set up semaphore, mutex, producer, consumer threads and join them
    if(sem_init(&count_lock, 0, 1) != 0){
        perror("Semaphore initialization failed");
        return 1;
    }

    if (pthread_mutex_init(&prime_count_lock, NULL) != 0) {
        perror("Mutex initialization failed");
        return 1;
    }

    pthread_t producer_threads[MAX_THREADS];

    for (int i = 0; i < MAX_THREADS; i++) {
        if (pthread_create(&producer_threads[i], NULL, producer, &limit_number) != 0) {
            perror("Failed to create producer thread");
            return 1;
        }
    }

    pthread_t consumer_thread;
    if (pthread_create(&consumer_thread, NULL, consumer, &limit_number) != 0) {
        perror("Failed to create consumer thread");
        return 1;
    }

    for (int i = 0; i < MAX_THREADS; i++) {
        if (pthread_join(producer_threads[i], NULL) != 0) {
            perror("Failed to join producer thread");
            return 1;
        }
    }

    if (pthread_join(consumer_thread, NULL) != 0) {
        perror("Failed to join consumer thread");
        return 1;
    }

    // Clean up prime_numbers array, semaphore, and mutex
    free(prime_numbers);
    sem_destroy(&count_lock);
    pthread_mutex_destroy(&prime_count_lock);

    return 0;
}