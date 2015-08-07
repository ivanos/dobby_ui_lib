# dobby_ui
Dobby UI is a web UI for inspecting Dobby.  It relies on the Dobby REST interface.

## Including in Erlang Node
1. Add dobby_ui_lib as a rebar dependency:
```
{dobby_ui, "", {git, "https://github.com/ivanos/dobby_ui_lib.git", {branch, "master"}}, [raw]},
```
2. dobby_ui_lib requires npm to compile. Add pre_hook to verify npm is installed:
```
{pre_hooks, [{'get-deps', "sh -c 'npm --version >> /dev/null || (echo \"npm not installed\"; exit 1)'"}]}.
```
3. Add a post_hook to compile dobby_ui:
```
{post_hooks, [{'get-deps', "sh -c 'cd deps/dobby_ui && npm install --unsafe-perm && cd -'"}]}.
```
4. Add a post_hook to copy the compiled ui into the dobby_rest priv dir:
```
{post_hooks, [{compile, "sh -c 'cp -r deps/dobby_ui/www deps/dobby_rest/priv/static'"}]}.
```

## rebar.config example
```
{deps,
 [{dobby_ui, "", {git, "https://github.com/ivanos/dobby_ui_lib.git",
                  {branch, "master"}}, [raw]}]
 }.

{pre_hooks, [{'get-deps', "sh -c 'npm --version >> /dev/null || (echo \"npm not installed\"; exit 1)'"}]}.

{post_hooks, [{'get-deps', "sh -c 'cd deps/dobby_ui && npm install --unsafe-perm && cd -'"},
              {compile,
               "sh -c 'cp -r deps/dobby_ui/www deps/dobby_rest/priv/static'"}]}.
```

## Usage
Dobby UI can be included in a Dobby REST server so that the Dobby UI is
served by the same webserver providing the REST interface. See
https://github.com/ivanos/dobby_allinone_node.git for an example.

To get sample data into dobby:

1. checkout weave from github
2. `cd util`
3. `./mk_json example_topology  > /tmp/json`
4. In the dobby console: `dby_bulk:import(json0, "/tmp/json").`
