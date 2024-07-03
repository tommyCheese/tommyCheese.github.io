import os
import shutil
import subprocess

home_dir = os.path.expanduser("~")
tommycheese_dir = os.path.join(home_dir, "tommycheese")
os.chdir(tommycheese_dir) # 进入blog目录
# print(os.listdir("."))

# # 执行Linux命令'hugo'
subprocess.run(['hugo'], check=True)

# # 复制public目录下的所有文件到folder1

# public_dir = os.path.join(os.getcwd(), "public")
# tommycheese_io_dir = os.path.join(home_dir, "tommyCheese.github.io")

# if not os.path.exists(tommycheese_io_dir):
#     os.makedirs(tommycheese_io_dir)


# os.chdir(tommycheese_io_dir)
# subprocess.run(['git', 'push'], check=True)
subprocess.run(["pwd"])
subprocess.run(['cp',"-r", './public', "~/tommyCheese.github.io"], check=True) # cp -r ./public/* ~/tommyCheese.github.io
