package vazkii.quark.base.world.config;

import vazkii.quark.base.module.Config;
import vazkii.quark.base.module.IConfigType;
import vazkii.quark.base.module.Module;

public class EntitySpawnConfig implements IConfigType {

	public Module module;

	@Config
	@Config.Min(value = 0, exclusive = true)
	public int spawnWeight = 40;

	@Config
	@Config.Min(1)
	public int minGroupSize = 1;

	@Config
	@Config.Min(1)
	public int maxGroupSize = 3;
	
	@Config
	public BiomeTypeConfig biomes;

	public EntitySpawnConfig(int spawnWeight, int minGroupSize, int maxGroupSize, BiomeTypeConfig biomes) {
		this.spawnWeight = spawnWeight;
		this.minGroupSize = minGroupSize;
		this.maxGroupSize = maxGroupSize;
		this.biomes = biomes;
	}
	
	public void setModule(Module module) {
		this.module = module;
	}

	public boolean isEnabled() {
		return module != null && module.enabled;
	}

}
