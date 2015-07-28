# dobby_ui
Dobby UI is a web UI for inspecting Dobby.  It relies on the Dobby REST interface.

## Usage
Dobby UI can be included in a Dobby REST server so that the Dobby UI is
served by the same webserver providing the REST interface. See
https://github.com/ivanos/dobby_allinone_node.git for an example.

To get sample data into dobby:

1. checkout weave from github
2. `cd util`
3. `./mk_json example_topology  > /tmp/json`
4. In the dobby console: `dby_bulk:import(json0, "/tmp/json").`
