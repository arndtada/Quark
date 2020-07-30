package vazkii.quark.world.module.underground;

import net.minecraftforge.common.BiomeDictionary.Type;
import vazkii.quark.base.module.LoadModule;
import vazkii.quark.base.module.ModuleCategory;
import vazkii.quark.world.config.UndergroundBiomeConfig;
import vazkii.quark.world.gen.underground.SlimeUndergroundBiome;

@LoadModule(category = ModuleCategory.WORLD)
public class SlimeUndergroundBiomeModule extends UndergroundBiomeModule {

	@Override
	protected UndergroundBiomeConfig getBiomeConfig() {
		return new UndergroundBiomeConfig(new SlimeUndergroundBiome(), 120, Type.SWAMP);
	}
	
	@Override
	protected String getBiomeName() {
		return "slime";
	}

}
