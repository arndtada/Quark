package vazkii.quark.base.module;

import java.util.ArrayList;
import java.util.List;

public enum ModuleCategory {

	// Categories
	AUTOMATION("automation"),
	BUILDING("building"),
	MANAGEMENT("management"),
	TOOLS("tools"),
	TWEAKS("tweaks"),
	WORLD("world"),
	MOBS("mobs"),
	CLIENT("client"),
	ODDITIES("oddities"),
	EXPERIMENTAL("experimental");
	
	public final String name;
	public boolean enabled;
	
	private List<Module> ownedModules = new ArrayList<>();
	
	ModuleCategory(String name) {
		this.name = name;
		this.enabled = true;
	}
	
	public void addModule(Module module) {
		ownedModules.add(module);
	}
	
	public List<Module> getOwnedModules() {
		return ownedModules;
	}
	
}
