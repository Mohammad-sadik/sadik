import re

path = r'c:\Users\Sadik\Downloads\personal\portfolio-react\frontend\src\components\Work.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'(<div className=\"timeline-row\">.*?<i className=\x27bx .*?\x27></i>\s*</div>\s*</div>)'
rows = re.findall(pattern, content, flags=re.DOTALL)

if len(rows) == 5:
    print('Found 5 rows!')
    reversed_rows = '\n\n          '.join(rows[::-1])
    
    start_str = '<div className=\"timeline-container\">'
    end_str = '</div>\n      </div>\n\n      <h2 className=\"section-title\">Featured Work</h2>'
    
    start_idx = content.find(start_str) + len(start_str)
    end_idx = content.find(end_str)
    
    new_content = content[:start_idx] + '\n          \n          ' + reversed_rows + '\n\n        ' + content[end_idx:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print('Found', len(rows), 'rows. Expected 5.')
