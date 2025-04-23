import os
import pyperclip

EXCLUDE_NAMES = {'.bolt', 'bolt', 'node_modules'}
EXCLUDE_CONTAINS = {'cache'}
IMAGES_FOLDER_NAME = 'images'
NPM_PACKAGES = {'node_modules', 'package-lock.json', 'package.json'}


def is_excluded(name: str) -> bool:
    if name in EXCLUDE_NAMES:
        return True
    for excl in EXCLUDE_CONTAINS:
        if excl in name:
            return True
    return False

def is_npm_package_file(name: str) -> bool:
    return name in NPM_PACKAGES

def build_tree_str(root: str, prefix: str = "", in_images: bool = False) -> str:
    lines = []
    entries = [e for e in os.listdir(root) if not is_excluded(e)]
    entries.sort()
    for idx, entry in enumerate(entries):
        path = os.path.join(root, entry)
        connector = "└── " if idx == len(entries) - 1 else "├── "
        if os.path.isdir(path):
            lines.append(f"{prefix}{connector}{entry}/")
            if entry == IMAGES_FOLDER_NAME:
                image_files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
                image_files.sort()
                for i, img in enumerate(image_files):
                    img_connector = "└── " if i == len(image_files) - 1 else "├── "
                    lines.append(f"{prefix}    {img_connector}{img}")
            else:
                lines.append(build_tree_str(path, prefix + ("    " if idx == len(entries) - 1 else "│   "), in_images=(in_images or entry == IMAGES_FOLDER_NAME)))
        else:
            lines.append(f"{prefix}{connector}{entry}")
            # Mostrar conteúdo se não for npm, não estiver em images, nem for bolt
            if not in_images and not is_npm_package_file(entry):
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    # Limitar tamanho para arquivos muito grandes
                    if len(content) > 2000:
                        content = content[:2000] + '\n... [truncado] ...'
                    for line in content.splitlines():
                        lines.append(f"{prefix}    {line}")
                except Exception as e:
                    lines.append(f"{prefix}    [Erro ao ler arquivo: {e}]")
    return "\n".join(lines)

if __name__ == "__main__":
    tree_str = ".\n" + build_tree_str(".")
    print(tree_str)
    try:
        pyperclip.copy(tree_str)
        print("\nÁrvore copiada para o clipboard!")
    except Exception as e:
        print(f"\nNão foi possível copiar para o clipboard: {e}\nInstale o pacote pyperclip se necessário: pip install pyperclip") 