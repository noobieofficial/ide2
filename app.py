import io
import sys
from func import *
from noobie02 import NoobieInterpreter
from contextlib import redirect_stderr, redirect_stdout
from flask import Flask, request, render_template, redirect, url_for, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/print", methods=["POST"])
def print_code():
    code = request.form.get("program", "")
    if not code.strip():
        return jsonify({"output": "No code written"})
    
    # serve per catturare stdout e stderr (vanno trattate come stringhe)
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()

    try:
        interpreter = NoobieInterpreter()
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            interpreter.interpret(code)
        output = stdout_buffer.getvalue()
        errors = stderr_buffer.getvalue()
        final_output = (output + (errors if errors else "")).strip()
        if not final_output:
            final_output = "No output generated"
    except SystemExit:
        # evita che sys.exit() chiuda il server
        output = stdout_buffer.getvalue()
        errors = stderr_buffer.getvalue()
        final_output = (output + (errors if errors else "")).strip()
    except Exception as e:
        final_output = f"Error during execution: {str(e)}"

    return jsonify({"output": final_output})


if __name__ == '__main__':
    app.run(debug=True)
