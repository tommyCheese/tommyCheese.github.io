import argparse

def parse_md(file_path:str):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            metaProcess(content) # 处理图像元数据
            imgProcess(content) #图片转存到根目录并且更换md内的图像路径
    except FileNotFoundError:
        print("md文件不存在")
    except IOError:
        print("无法读取文件")


if __name__=="__main__":
    # 创建参数解析器
    parser = argparse.ArgumentParser(description='命令行解析')

    parser.add_argument('-mode', help='输出文件的路径(newpost|deletepost|addimg|refreshimg)', default="newpost")
    parser.add_argument("-md_path", help="新建博文时使用，md文件路径")
    # parser.add_argument
    args = parser.parse_args()

    # 获取操作类型
    modes = ["newpost","deletepost","addimg","refreshimg"]
    mode:str = args.mode
    mode = mode.lower()
    if mode not in modes:
        print("操作类型错误，仅可使用", modes)
        exit()
    if mode=="newpost": #新建博文
        md_path = args.md_path
        if md_path==None:
            print("md文件不存在")
            exit()
        file_extension = md_path.split('.')[-1]
        if file_extension!="md":
            print("请输入md文件")
            exit()
        parse_md(md_path)
        
    elif mode=="deletepost": # 删除博文
        pass
    elif mode=="addimg": # 添加explore图像
        pass
    elif mode=="refreshimg": #
        pass
    
