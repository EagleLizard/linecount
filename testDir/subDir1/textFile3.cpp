#include <exception>
#include <iostream>
#include <string>
#include <cstdlib>
#include <time.h>

using namespace std;

class russianRoulette {
	string data;
	int chance;
	void pullTrigger(){
		if(rand()%chance == 0){
			delete this;
		}
	}
public:
	russianRoulette(){
		chance = 6;
	}
	russianRoulette(int _chance){
		chance = _chance;
	}
	void set(const char cstr[]){
		string temp = cstr;
		set(temp);
	}
	void set(string &s){
		pullTrigger();
		data = s;
	}
	string get(){
		pullTrigger();
		return data;
	}
	~russianRoulette(){
		cout << ":(" << endl;
	}
};
void testRoulette(){

}
int main(){
	srand(time(NULL));
	string input;
	string output;
	string end = "0";
	russianRoulette r;
	do{
		getline(cin,input);
		r.set(":)");
		output = r.get();
		cout << output << endl;
	}while(input.compare(end));
	return 0;
}
