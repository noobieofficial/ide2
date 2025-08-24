import io
import sys
import secrets
from func import *
from noobie02ide import NoobieInterpreter
from contextlib import redirect_stderr, redirect_stdout
from flask import Flask, request, render_template, abort, jsonify

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/execute", methods=["POST"])
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


@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True)
