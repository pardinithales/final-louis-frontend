# tree_to_clipboard.py
import os
from pathlib import Path
import pyperclip # type: ignore

def format_file_content(relative_path: str, content: str) -> str:
    """Formats the file path and content for the clipboard."""
    return f"### FILE: {relative_path} ###\n\n{content}\n\n"

def main():
    root_dir = Path("c:\\Users\\Usuario\\Downloads\\project-bolt-sb1-h1dywwpx\\project") # Use o Path absoluto do seu projeto
    exclude_dirs = {'node_modules', 'images', 'static/images'}
    include_extensions = {'.tsx', '.json', '.ts'}

    file_contents_map = {}

    # Percorre recursivamente
    for path in root_dir.rglob('*'):
        if path.is_file() and path.suffix in include_extensions:
            # Checa se algum diretório pai está na lista de exclusão
            is_excluded = False
            for part in path.relative_to(root_dir).parts:
                if part in exclude_dirs:
                    is_excluded = True
                    break
            
            # Checa especificamente por 'static/images'
            relative_path_str = str(path.relative_to(root_dir)).replace('\\', '/')
            if 'static/images' in relative_path_str:
                is_excluded = True

            if not is_excluded:
                # Adiciona o path relativo (formato Unix-like para consistência)
                relative_path = path.relative_to(root_dir).as_posix()
                try:
                    content = path.read_text(encoding='utf-8')
                    file_contents_map[relative_path] = content
                except Exception as e:
                    print(f"Erro ao ler {relative_path}: {e}")

    # Ordena e junta as linhas
    sorted_paths = sorted(file_contents_map.keys())
    clipboard_content = "".join(
        format_file_content(path, file_contents_map[path]) for path in sorted_paths
    )

    # Copia para o clipboard
    try:
        pyperclip.copy(clipboard_content)
        print(f"Conteúdo de {len(sorted_paths)} arquivos copiado para o clipboard.")
    except pyperclip.PyperclipException as e:
        print(f"Erro ao copiar para o clipboard: {e}")
        print("Conteúdo a ser copiado manualmente:")
        print(clipboard_content)

if __name__ == "__main__":
    main()