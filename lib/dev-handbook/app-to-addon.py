import os
from pathlib import Path

# go through the addon tree
# for each .ts and .hbs file, build a match reexport in the app tree

source_root = Path('./addon')
target_root = Path('./app')

def generate_reexport(file_path, root_import_name):
    # get the same path in app tree
    relative_path = file_path.relative_to(source_root)
    reexport_path = target_root.joinpath(relative_path.with_suffix('.js'))
    import_path = f"{root_import_name}/{relative_path.with_suffix('')}"

    print(f're-exporting {relative_path}')

    # create folders in app tree, if need be
    reexport_path.parent.mkdir(parents=True, exist_ok=True)

    reexport_path.write_text(
        f"export {{ default }} from '{import_path}';\n"
    )

def generate_reexports_recursive(folder_path, root_import_name):
    for child in folder_path.iterdir():
        if child.is_dir():
            generate_reexports_recursive(child, root_import_name)
        elif child.is_file() and child.suffix in ('.ts', '.js', '.hbs', '.md'):
            generate_reexport(child, root_import_name)

if __name__ == '__main__':
    generate_reexports_recursive(source_root, root_import_name='dev-handbook')
