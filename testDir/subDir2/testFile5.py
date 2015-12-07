import sys

def contains(list, item):
    for val in list:
        if val == item: return True
    return False

test_cases = open(sys.argv[1], 'r')
for test in test_cases:
    if not test:
        continue

    nums = test.strip().split(',');
    unique = []

    for num in nums:
        if num not in unique:
            unique.append(num)

    print ','.join(unique);


test_cases.close()
