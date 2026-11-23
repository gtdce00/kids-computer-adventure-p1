"""สร้างข้อมูลเกม games/m2-python (Python PRIMM ม.2)
รันโค้ดทุกข้อด้วย Python จริงเพื่อให้ผลลัพธ์ ร่องรอยการทำงาน (trace) และข้อความ Error ถูกต้อง 100%
แล้วฝังข้อมูลลงใน games/m2-python/index.html ระหว่าง /*DATA*/ ... /*END*/
ใช้: python3 tools/build_m2python.py   (แก้ข้อสอบที่ไฟล์นี้ แล้วรันใหม่)"""
import io, json, re, sys, contextlib, pathlib

def run(code, trace=False):
    """คืน (output, error_line_text_or_None, steps)"""
    out = io.StringIO(); steps = []; prev = [None]; g = {}
    def snap():
        v = {k: repr(x) for k, x in g.items() if not k.startswith('__')}
        return v
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<code>':
            return None
        if event == 'line':
            if prev[0] is not None:
                steps.append({'l': prev[0] - 1, 'v': snap(), 'o': out.getvalue()})
            prev[0] = frame.f_lineno
        elif event == 'return' and prev[0] is not None:
            steps.append({'l': prev[0] - 1, 'v': snap(), 'o': out.getvalue()}); prev[0] = None
        return tracer
    err = None
    try:
        c = compile(code, '<code>', 'exec')
        with contextlib.redirect_stdout(out):
            if trace: sys.settrace(tracer)
            try: exec(c, g)
            finally: sys.settrace(None)
    except Exception as e:
        err = f'{type(e).__name__}: {e.msg if isinstance(e, SyntaxError) else e}'
        if isinstance(e, SyntaxError) and e.lineno: err += f'  (บรรทัด {e.lineno})'
    assert len(steps) <= 60, 'trace ยาวเกินไป'
    return out.getvalue().rstrip('\n'), err, steps

# ---------------- 1) ทายผล (Predict) → รันดู (Run) ----------------
PREDICT = [
    ('print และตัวแปร', 'name = "แมว"\nprint("สวัสดี", name)', ['สวัสดี name', 'สวัสดีแมว', 'Error'],
     'print ที่มีหลายค่าคั่นด้วย , จะเว้นวรรคให้ 1 ช่อง และ name ไม่มี " " จึงแสดงค่าในตัวแปร'),
    ('บวก คูณ', 'a = 7\nb = 2\nprint(a + b)\nprint(a * b)', ['72\n14', '9\n72', 'a + b\na * b'],
     'a และ b เก็บตัวเลข จึงบวก/คูณกันได้ และ print 2 ครั้ง ได้ 2 บรรทัด'),
    ('เปลี่ยนค่าตัวแปร', 'x = 5\nx = x + 3\nprint(x)', ['5', '53', 'x + 3'],
     'x = x + 3 คือ เอาค่าเดิมของ x (5) บวก 3 แล้วเก็บกลับเข้า x'),
    ('หารปัดเศษ และหารเอาเศษ', 'print(7 // 2, 7 % 2)', ['3.5 0', '1 3', '3 0.5'],
     '// หารแล้วเอาแต่จำนวนเต็ม (7 // 2 = 3) และ % ให้เศษ (7 % 2 = 1)'),
    ('ต่อข้อความ', 's = "Py" + "thon"\nprint(s * 2)', ['Python 2', 'Python\nPython', 'Error'],
     'ข้อความ + ข้อความ = ต่อกัน และ ข้อความ * 2 = ซ้ำ 2 ครั้งติดกัน'),
    ('if / else', 'score = 65\nif score >= 50:\n    print("ผ่าน")\nelse:\n    print("ไม่ผ่าน")', ['ไม่ผ่าน', 'ผ่าน\nไม่ผ่าน', '(ไม่แสดงอะไร)'],
     '65 >= 50 เป็นจริง (True) จึงทำเฉพาะส่วนของ if และข้ามส่วน else'),
    ('if / elif / else', 't = 30\nif t > 35:\n    print("ร้อนมาก")\nelif t > 25:\n    print("อุ่น")\nelse:\n    print("เย็น")', ['ร้อนมาก', 'อุ่น\nเย็น', 'เย็น'],
     'ตรวจจากบนลงล่าง 30 > 35 เท็จ → ตรวจ elif 30 > 25 จริง → แสดง "อุ่น" แล้วหยุด ไม่ตรวจต่อ'),
    ('for กับ range', 'for i in range(3):\n    print(i)', ['1\n2\n3', '0\n1\n2\n3', '3'],
     'range(3) ให้ค่า 0, 1, 2 (เริ่มที่ 0 และไม่ถึง 3)'),
    ('สะสมผลรวม', 'total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)', ['10', '3', '1\n3\n6'],
     'range(1, 4) คือ 1, 2, 3 → total = 0+1+2+3 = 6 และ print อยู่นอกลูป จึงแสดงครั้งเดียว'),
    ('while นับถอยหลัง', 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("ปล่อยจรวด!")', ['3\n2\n1\n0\nปล่อยจรวด!', '3\nปล่อยจรวด!', '2\n1\n0\nปล่อยจรวด!'],
     'วนซ้ำขณะ n > 0 เมื่อ n เหลือ 0 เงื่อนไขเป็นเท็จ ลูปจึงหยุด (ไม่แสดง 0)'),
    ('ลิสต์', 'fruits = ["กล้วย", "มะม่วง", "ส้ม"]\nprint(fruits[1])\nprint(len(fruits))', ['กล้วย\n3', 'มะม่วง\n2', 'ส้ม\n3'],
     'ลำดับในลิสต์เริ่มที่ 0 → fruits[1] คือตัวที่ 2 = มะม่วง และ len() นับจำนวนสมาชิก = 3'),
]

# ---------------- 2) สืบโค้ด (Investigate) ----------------
INVESTIGATE = [
    {'t': 'line', 'code': 'print("เริ่ม")\nfor i in range(5):\n    print("⭐")\nprint("จบ")', 'q': 'บรรทัดไหน<b>ทำงานซ้ำ 5 ครั้ง</b>?', 'a': [2],
     'why': 'บรรทัดที่ย่อหน้าอยู่ใต้ for คือส่วนที่ทำซ้ำ (range(5) = 5 รอบ)'},
    {'t': 'line', 'code': 'score = 40\nif score >= 50:\n    print("ผ่าน")\nelse:\n    print("ไม่ผ่าน")', 'q': 'บรรทัดไหนทำงานเมื่อเงื่อนไข<b>เป็นเท็จ (False)</b>?', 'a': [4],
     'why': 'เมื่อ score >= 50 เป็นเท็จ โปรแกรมจะไปทำบรรทัดที่ย่อหน้าอยู่ใต้ else'},
    {'t': 'line', 'code': 'price = 120\nqty = 3\npay = price * qty\nprint("จ่าย", pay, "บาท")', 'q': 'บรรทัดไหน<b>คำนวณเงินที่ต้องจ่าย</b>?', 'a': [2],
     'why': 'pay = price * qty คือการคำนวณ (ราคา × จำนวน) แล้วเก็บผลไว้ในตัวแปร pay'},
    {'t': 'mcq', 'code': 'price = 120\nqty = 3\npay = price * qty\nprint("จ่าย", pay, "บาท")', 'q': 'โปรแกรมนี้มี<b>ตัวแปรกี่ตัว</b>?', 'opts': ['3', '2', '4', '1'],
     'why': 'ตัวแปรคือชื่อที่อยู่หน้าเครื่องหมาย = มี price, qty, pay รวม 3 ตัว (print เป็นคำสั่ง ไม่ใช่ตัวแปร)', 'check': lambda st: str(len(st[-1]['v']))},
    {'t': 'line', 'code': 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("ปล่อยจรวด!")', 'q': 'ถ้า<b>ลบบรรทัดไหน</b>ออก ลูปจะวนไม่รู้จบ?', 'a': [3],
     'why': 'n = n - 1 ทำให้ n ลดลงจนเงื่อนไข n > 0 เป็นเท็จ ถ้าไม่มีบรรทัดนี้ n = 3 ตลอด ลูปไม่หยุด'},
    {'t': 'mcq', 'code': 'total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)', 'q': 'ในรอบ<b>สุดท้าย</b>ของลูป ตัวแปร n มีค่าเท่าไร?', 'opts': ['3', '4', '2', '6'],
     'why': 'range(1, 4) ให้ 1, 2, 3 ค่าสุดท้ายคือ 3 (ไม่ถึง 4)', 'check': lambda st: st[-1]['v']['n']},
    {'t': 'line', 'code': 'age = 13\nif age >= 12:\n    print("ตั๋วผู้ใหญ่")\nprint("ขอบคุณ")', 'q': 'บรรทัดไหนเป็น<b>เงื่อนไข</b> (คำถามที่ได้คำตอบ True/False)?', 'a': [1],
     'why': 'if age >= 12: คือการตรวจเงื่อนไข ผลเป็น True หรือ False'},
    {'t': 'mcq', 'code': 'for i in range(4):\n    print("🐟")\nprint("🐟")', 'q': 'โปรแกรมนี้แสดง 🐟 <b>ทั้งหมดกี่ตัว</b>?', 'opts': ['5', '4', '8', '1'],
     'why': 'ในลูป 4 ตัว + บรรทัดสุดท้ายอยู่นอกลูป (ไม่ย่อหน้า) อีก 1 ตัว = 5', 'check': lambda st: str(st[-1]['o'].count('🐟'))},
]

# ---------------- 3) จับบั๊ก (Bug) ----------------
BUGS = [
    ('x = 10\nif x > 5\n    print("มากกว่า 5")', 1, ['if x > 5:', 'if (x > 5)', 'if x > 5;', 'If x > 5:'], 'มากกว่า 5', 'หลัง if, elif, else, for, while ต้องมีเครื่องหมาย : (โคลอน) เสมอ'),
    ('name = "Mali"\nprnt("Hello", name)', 1, ['print("Hello", name)', 'Print("Hello", name)', 'print(Hello, name)', 'prnt("Hello" name)'], 'Hello Mali', 'สะกดคำสั่งผิด (prnt) Python ไม่รู้จัก ต้องเป็น print ตัวพิมพ์เล็กทั้งหมด'),
    ('print("สวัสดีชาวโลก)', 0, ['print("สวัสดีชาวโลก")', 'print(สวัสดีชาวโลก)', 'print("สวัสดีชาวโลก)"', 'print"สวัสดีชาวโลก"'], 'สวัสดีชาวโลก', 'ข้อความต้องมีเครื่องหมาย " เปิดและปิดครบคู่'),
    ('for i in range(3):\nprint(i)', 1, ['    print(i)', 'print(i):', 'print (i)', 'print(i);'], '0\n1\n2', 'คำสั่งที่อยู่ในลูปต้อง<b>ย่อหน้า</b> (เว้น 4 ช่อง) ไม่อย่างนั้นเกิด IndentationError'),
    ('ans = 4\nif ans = 4:\n    print("ถูกต้อง")', 1, ['if ans == 4:', 'if ans := 4', 'if ans = = 4:', 'if 4 = ans:'], 'ถูกต้อง', '= ใช้<b>เก็บค่า</b> ส่วน == ใช้<b>เปรียบเทียบ</b>ว่าเท่ากันไหม'),
    ('age = 13\nprint("อายุ " + age + " ปี")', 1, ['print("อายุ " + str(age) + " ปี")', 'print("อายุ " + int(age) + " ปี")', 'print("อายุ " + "age" + " ปี")', 'print("อายุ " + age, + " ปี")'], 'อายุ 13 ปี', 'ข้อความ + ตัวเลข ไม่ได้ ต้องแปลงตัวเลขเป็นข้อความด้วย str() ก่อน'),
    ('# ต้องการแสดงเลข 1 ถึง 5\nfor i in range(1, 5):\n    print(i)', 1, ['for i in range(1, 6):', 'for i in range(0, 5):', 'for i in range(5):', 'for i in range(1, 5, 1):'], '1\n2\n3\n4\n5', '<b>บั๊กตรรกะ</b>: โปรแกรมไม่ Error แต่ผลผิด range(1, 5) หยุดก่อนถึง 5 ต้องใช้ range(1, 6)'),
    ('# ต้องการหาค่าเฉลี่ยของ a และ b\na = 8\nb = 6\navg = a + b / 2\nprint(avg)', 3, ['avg = (a + b) / 2', 'avg = a + (b / 2)', 'avg = a + b // 2', 'avg = a / 2 + b'], '7.0', '<b>บั๊กตรรกะ</b>: Python คิด / ก่อน + จึงต้องใส่วงเล็บ (a + b) ก่อนหาร'),
]

# ---------------- 4) แก้โค้ด (Modify) ----------------
MODIFY = [
    ('print("สวัสดี", ___)', ['"ม.2"', 'ม.2', '"ม.2', 'name'], 'ข้อความต้องอยู่ในเครื่องหมาย " "'),
    ('for i in range(___):\n    print("⭐")', ['4', '3', '5', '"4"'], 'range(4) วน 4 รอบ (ใส่ "4" เป็นข้อความจะ Error)'),
    ('n = 8\nif n % 2 ___ 0:\n    print("คู่")\nelse:\n    print("คี่")', ['==', '=', '!=', '>'], 'เลขคู่หาร 2 เหลือเศษ 0 จึงใช้ n % 2 == 0'),
    ('for i in range(2, 11, ___):\n    print(i)', ['2', '1', '3', '10'], 'ตัวที่ 3 ใน range คือ "ก้าว" เพิ่มทีละ 2 ได้ 2, 4, 6, 8, 10'),
    ('total = 0\nfor n in range(1, 6):\n    total = total ___ n\nprint(total)', ['+', '*', '-', '='], 'สะสมผลรวม total = total + n → 1+2+3+4+5 = 15'),
    ('n = 5\nwhile n ___ 0:\n    print(n)\n    n = n - 1', ['>', '>=', '<', '=='], 'n > 0 หยุดเมื่อ n เป็น 0 (ถ้าใช้ >= จะแสดง 0 ด้วย)'),
]
MODIFY_TARGET = ['สวัสดี ม.2', '⭐\n⭐\n⭐\n⭐', 'คู่', '2\n4\n6\n8\n10', '15', '5\n4\n3\n2\n1']

def build():
    data = {'predict': [], 'inv': [], 'bug': [], 'mod': []}
    for title, code, wrong, why in PREDICT:
        out, err, steps = run(code, trace=True)
        assert err is None and out not in wrong, (title, out, err)
        data['predict'].append({'title': title, 'code': code, 'out': out, 'opts': [out] + wrong, 'why': why, 'steps': steps})
    for it in INVESTIGATE:
        out, err, steps = run(it['code'], trace=True); assert err is None
        d = {k: v for k, v in it.items() if k != 'check'}
        if it['t'] == 'mcq':
            assert it['check'](steps) == it['opts'][0], (it['q'], it['check'](steps))
        else:
            for a in it['a']: assert it['code'].split('\n')[a].strip()
        data['inv'].append(d)
    for code, line, fixes, want, why in BUGS:
        out, err, _ = run(code)
        assert err or out != want, code
        lines = code.split('\n')
        for k, f in enumerate(fixes):
            fixed = '\n'.join(f if j == line else x for j, x in enumerate(lines))
            o2, e2, _ = run(fixed)
            ok = (e2 is None and o2 == want)
            assert ok == (k == 0), (code, f, o2, e2)
        data['bug'].append({'code': code, 'line': line, 'opts': fixes, 'err': err, 'got': out, 'want': want, 'why': why})
    for (code, chips, why), want in zip(MODIFY, MODIFY_TARGET):
        res = []
        for k, c in enumerate(chips):
            o2, e2, _ = run(code.replace('___', c))
            assert (e2 is None and o2 == want) == (k == 0), (code, c, o2, e2)
            res.append(e2 if e2 else (o2 if o2 else '(ไม่แสดงอะไร)'))
        data['mod'].append({'code': code, 'opts': chips, 'want': want, 'res': res, 'why': why})
    p = pathlib.Path(__file__).resolve().parent.parent / 'games/m2-python/index.html'
    s = p.read_text(encoding='utf-8')
    js = 'const DATA = ' + json.dumps(data, ensure_ascii=False) + ';'
    s2, n = re.subn(r'/\*DATA\*/.*?/\*END\*/', lambda m: '/*DATA*/' + js + '/*END*/', s, flags=re.S)
    assert n == 1
    p.write_text(s2, encoding='utf-8')
    print('ok', {k: len(v) for k, v in data.items()})

if __name__ == '__main__':
    build()
