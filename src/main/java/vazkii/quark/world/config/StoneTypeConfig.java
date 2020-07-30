package vazkii.quark.world.config;

import vazkii.quark.base.module.Config;
import vazkii.quark.base.module.IConfigType;
import vazkii.quark.base.world.config.DimensionConfig;
import vazkii.quark.base.world.config.OrePocketConfig;

public class StoneTypeConfig implements IConfigType {

	@Config
	public DimensionConfig dimensions;
	@Config
	public OrePocketConfig oregen = new OrePocketConfig(0, 256, 33, 10);

	public StoneTypeConfig(boolean nether) {
		dimensions = nether ? DimensionConfig.nether(false) : DimensionConfig.overworld(false);
	}

}
