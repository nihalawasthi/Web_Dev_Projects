import LBlock
import LED64
import hight
import present
import twine80
import blowfish

def phablet():
    plaintext = input("Enter PlainText : ")
    key = input("Enter Key : ")
    
    # Encrypt using LBlock
    output1 = LBlock.call(plaintext, key)
    print("Encryption 1:", output1)
    ascii_out1 = ''.join(str(ord(char)) for char in output1)
    
    # Encrypt using hight
    output2 = hight.call(ascii_out1)
    print("Encryption 2:", output2)
    
    output3 = present.call(output2)
    print("Encryption 3:", output3)
    out3 = hex(int(output3))
    out3 = out3[2:]
    out3 = int(out3, 16)
    
    output4 = blowfish.call(out3)
    print("Encryption 4:", output4)
    out4 = ''.join(format(ord(x), '08b') for x in str(output4))
    print(out4)
    out4 = str(out4)
    
    output5 = LED64.call(out4)
    print("Encryption 5:", output5)
    
    output6 = twine80.call(output5)
    print("Encryption 6:", output6)

if __name__ == "__main__":
    phablet()
